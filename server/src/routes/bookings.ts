import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Helper to generate reference: TE-2026-XXXXX
function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomCode = '';
  for (let i = 0; i < 5; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TE-2026-${randomCode}`;
}

// Indian mobile regex: optional +91 or 91, then 10 digits starting with 6-9
const INDIAN_PHONE_REGEX = /^(?:(?:\+|0{0,2})91(\s*[- ]\s*)?|[0]?)?[6789]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to parse booking record with attached services
function formatBooking(row: any) {
  const servicesRaw = db.prepare(`
    SELECT s.* FROM services s
    JOIN booking_services bs ON s.id = bs.service_id
    WHERE bs.booking_id = ?
  `).all(row.id) as any[];

  const services = servicesRaw.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    shortDescription: s.short_description,
    imageUrl: s.image_url,
    startingPrice: s.starting_price,
    features: JSON.parse(s.features || '[]'),
    isActive: Boolean(s.is_active),
  }));

  return {
    id: row.id,
    bookingReference: row.booking_reference,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    eventDate: row.event_date,
    eventTime: row.event_time,
    venue: row.venue,
    city: row.city,
    guestCount: row.guest_count,
    budget: row.budget,
    packagePreference: row.package_preference,
    quotationAmount: row.quotation_amount,
    status: row.status,
    customerMessage: row.customer_message,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    services,
  };
}

// 1. Submit Booking Enquiry (Public)
router.post('/', (req: Request, res: Response) => {
  const {
    customerName,
    phone,
    email,
    eventType,
    services,
    eventDate,
    eventTime,
    venue,
    city,
    guestCount,
    budget,
    packagePreference,
    customerMessage,
    privacyAccepted,
  } = req.body;

  // Validation
  const errors: Record<string, string> = {};

  if (!customerName || customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name (at least 2 characters).';
  }

  const cleanPhone = (phone || '').replace(/[\s-]/g, '');
  if (!phone || !INDIAN_PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
  }

  if (email && email.trim() !== '' && !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!eventType) {
    errors.eventType = 'Please select an event type.';
  }

  if (!Array.isArray(services) || services.length === 0) {
    errors.services = 'Please select at least one required service.';
  }

  if (!eventDate) {
    errors.eventDate = 'Please select your event date.';
  } else {
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.eventDate = 'Event date cannot be in the past.';
    }
  }

  if (!venue || venue.trim().length < 3) {
    errors.venue = 'Please specify the venue or area.';
  }

  if (!city || city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }

  const parsedGuests = Number(guestCount);
  if (!guestCount || isNaN(parsedGuests) || parsedGuests <= 0) {
    errors.guestCount = 'Please provide expected guest count (minimum 1).';
  }

  if (!privacyAccepted) {
    errors.privacyAccepted = 'You must agree to our privacy terms to submit an enquiry.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  try {
    const id = `bkg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let reference = generateBookingReference();

    // Ensure reference uniqueness
    let exists = db.prepare('SELECT id FROM bookings WHERE booking_reference = ?').get(reference);
    while (exists) {
      reference = generateBookingReference();
      exists = db.prepare('SELECT id FROM bookings WHERE booking_reference = ?').get(reference);
    }

    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, booking_reference, customer_name, phone, email,
        event_type, event_date, event_time, venue, city,
        guest_count, budget, package_preference, status,
        customer_message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    insertBooking.run(
      id,
      reference,
      customerName.trim(),
      cleanPhone,
      email ? email.trim() : null,
      eventType,
      eventDate,
      eventTime || 'Full Day',
      venue.trim(),
      city.trim(),
      parsedGuests,
      budget || 'Flexible',
      packagePreference || 'Standard',
      customerMessage ? customerMessage.trim() : null
    );

    // Insert selected services
    const insertServiceJunction = db.prepare('INSERT INTO booking_services (booking_id, service_id) VALUES (?, ?)');
    for (const serviceId of services) {
      try {
        insertServiceJunction.run(id, serviceId);
      } catch (err) {
        console.warn(`Could not attach service ${serviceId}:`, err);
      }
    }

    const createdRecord = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    const formatted = formatBooking(createdRecord);

    return res.status(201).json({
      success: true,
      message: 'Booking enquiry submitted successfully. Our team will review and contact you with a quotation.',
      booking: formatted,
    });
  } catch (error: any) {
    console.error('Error submitting booking:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process booking enquiry. Please try again or reach out on WhatsApp.',
    });
  }
});

// 2. Lookup Booking Status (Public)
router.get('/lookup/:reference', (req: Request, res: Response) => {
  const { reference } = req.params;
  const { phone } = req.query;

  try {
    let query = 'SELECT * FROM bookings WHERE booking_reference = ?';
    const refStr = Array.isArray(reference) ? reference[0] : (reference || '');
    const params: any[] = [refStr.trim().toUpperCase()];

    if (phone) {
      query += ' AND phone LIKE ?';
      params.push(`%${phone}%`);
    }

    const row = db.prepare(query).get(...params);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'No booking enquiry found with this reference number.',
      });
    }

    return res.json({
      success: true,
      booking: formatBooking(row),
    });
  } catch (error: any) {
    console.error('Lookup error:', error);
    return res.status(500).json({ success: false, message: 'Server error during booking lookup.' });
  }
});

// 3. Admin: Dashboard Overview Statistics (Protected)
router.get('/stats', authenticateToken, (req: Request, res: Response) => {
  try {
    const totalEnquiries = (db.prepare('SELECT COUNT(*) as count FROM bookings').get() as any).count;
    const pendingEnquiries = (db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Pending'").get() as any).count;
    const quotationSent = (db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Quotation Sent'").get() as any).count;
    const confirmedBookings = (db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Confirmed'").get() as any).count;
    const completedEvents = (db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Completed'").get() as any).count;
    const cancelledBookings = (db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Cancelled'").get() as any).count;

    // Upcoming events: confirmed or quotation sent with event_date >= current date
    const today = new Date().toISOString().split('T')[0];
    const upcomingEvents = (db.prepare(`
      SELECT COUNT(*) as count FROM bookings 
      WHERE event_date >= ? AND status NOT IN ('Cancelled', 'Completed')
    `).get(today) as any).count;

    // Total quotation amount
    const totalQuotationValue = (db.prepare(`
      SELECT COALESCE(SUM(quotation_amount), 0) as total FROM bookings 
      WHERE status IN ('Quotation Sent', 'Confirmed', 'Completed')
    `).get() as any).total;

    return res.json({
      success: true,
      stats: {
        totalEnquiries,
        pendingEnquiries,
        quotationSent,
        confirmedBookings,
        completedEvents,
        cancelledBookings,
        upcomingEvents,
        totalQuotationValue,
      },
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate dashboard statistics.' });
  }
});

// 4. Admin: List all bookings with search and filters (Protected)
router.get('/', authenticateToken, (req: Request, res: Response) => {
  try {
    const { search, status, service, dateFrom, dateTo, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT DISTINCT b.* FROM bookings b';
    const conditions: string[] = [];
    const params: any[] = [];

    if (service) {
      query += ' JOIN booking_services bs ON b.id = bs.booking_id';
      conditions.push('bs.service_id = ?');
      params.push(service);
    }

    if (status && status !== 'All') {
      conditions.push('b.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(b.booking_reference LIKE ? OR b.customer_name LIKE ? OR b.phone LIKE ? OR b.city LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (dateFrom) {
      conditions.push('b.event_date >= ?');
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push('b.event_date <= ?');
      params.push(dateTo);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = db.prepare(query).all(...params) as any[];
    const bookings = rows.map(formatBooking);

    return res.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
});

// 5. Admin: Get single booking (Protected)
router.get('/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    return res.json({ success: true, booking: formatBooking(row) });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
});

// 6. Admin: Update booking status (Protected)
router.patch('/:id/status', authenticateToken, (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const allowed = ['Pending', 'Contacted', 'Quotation Sent', 'Confirmed', 'Completed', 'Cancelled'];

  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
  }

  try {
    const existing = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    let updateQuery = 'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [status];

    if (adminNotes !== undefined) {
      updateQuery += ', admin_notes = ?';
      params.push(adminNotes);
    }

    updateQuery += ' WHERE id = ?';
    params.push(req.params.id);

    db.prepare(updateQuery).run(...params);

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    return res.json({
      success: true,
      message: `Booking status updated to '${status}'.`,
      booking: formatBooking(updated),
    });
  } catch (error: any) {
    console.error('Status update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
});

// 7. Admin: Update quotation amount and internal notes (Protected)
router.patch('/:id/quotation', authenticateToken, (req: Request, res: Response) => {
  const { quotationAmount, adminNotes, status } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) as any;
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const amount = quotationAmount !== undefined && quotationAmount !== null && quotationAmount !== ''
      ? Number(quotationAmount)
      : existing.quotation_amount;

    const newStatus = status || (amount && existing.status === 'Pending' ? 'Quotation Sent' : existing.status);

    const update = db.prepare(`
      UPDATE bookings 
      SET quotation_amount = ?, admin_notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      amount,
      adminNotes !== undefined ? adminNotes : existing.admin_notes,
      newStatus,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
    return res.json({
      success: true,
      message: 'Quotation and notes saved successfully.',
      booking: formatBooking(updated),
    });
  } catch (error: any) {
    console.error('Quotation update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update quotation.' });
  }
});

// 8. Admin: Delete booking (Protected)
router.delete('/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const existing = db.prepare('SELECT id FROM bookings WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    return res.json({ success: true, message: 'Booking record deleted successfully.' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete booking.' });
  }
});

export default router;
