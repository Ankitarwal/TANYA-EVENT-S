import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get public site settings
router.get('/', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return res.json({
      success: true,
      settings: {
        brandName: settings['brand_name'] || "TANYA EVENT'S",
        tagline: settings['tagline'] || 'Making Every Celebration Unforgettable',
        phone: settings['phone'] || '+91 78568 31119',
        whatsapp: settings['whatsapp'] || '+91 78568 31119',
        email: settings['email'] || 'tanyaevents.booking@gmail.com',
        address: settings['address'] || 'South point public school, Laxmi Market, Dr. Shambhu Sharan Prasad, New Jakkanpur, Gardanibagh, Patna, Bihar, India - 800001',
        businessHours: settings['business_hours'] || 'Monday - Sunday: 9:00 AM – 9:00 PM (By Appointment)',
        instagramUrl: settings['instagram_url'] || 'https://instagram.com',
        facebookUrl: settings['facebook_url'] || 'https://facebook.com',
      },
    });
  } catch (error: any) {
    console.error('Settings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve site settings.' });
  }
});

// Admin: Update site settings
router.put('/', authenticateToken, (req: Request, res: Response) => {
  const settings = req.body;

  try {
    const upsert = db.prepare(`
      INSERT INTO site_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    const mapping: Record<string, string> = {
      brandName: 'brand_name',
      tagline: 'tagline',
      phone: 'phone',
      whatsapp: 'whatsapp',
      email: 'email',
      address: 'address',
      businessHours: 'business_hours',
      instagramUrl: 'instagram_url',
      facebookUrl: 'facebook_url',
    };

    for (const [key, value] of Object.entries(settings)) {
      const dbKey = mapping[key] || key;
      if (typeof value === 'string') {
        upsert.run(dbKey, value.trim());
      }
    }

    return res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
});

// Public: Contact form submission
router.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, message, subject } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
  }

  // Log contact enquiry or record in db
  console.log(`[Contact Form Received] From: ${name} (${phone}, ${email}) Subject: ${subject} Msg: ${message}`);

  return res.json({
    success: true,
    message: 'Thank you for reaching out to TANYA EVENT\'S! We have received your message and will respond promptly.',
  });
});

export default router;
