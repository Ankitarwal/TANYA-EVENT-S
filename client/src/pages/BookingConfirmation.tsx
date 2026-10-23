import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Clock,
  Calendar,
  MapPin,
  Users,
  Search,
  MessageCircle,
  FileText,
  Printer,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { bookingsApi } from '../services/api';
import { Booking } from '../types';
import { useToast } from '../context/ToastContext';

export const BookingConfirmation: React.FC = () => {
  const { reference } = useParams<{ reference?: string }>();
  const { showToast } = useToast();

  const [searchRef, setSearchRef] = useState<string>(reference || '');
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  useEffect(() => {
    if (reference) {
      lookupBooking(reference);
    }
  }, [reference]);

  const lookupBooking = async (refCode: string, phoneNum?: string) => {
    if (!refCode.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await bookingsApi.lookup(refCode.trim(), phoneNum?.trim());
      setBooking(data);
    } catch (err: any) {
      setBooking(null);
      showToast(err.message || 'Booking not found with this reference code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupBooking(searchRef, searchPhone);
  };

  const copyReference = () => {
    if (booking?.bookingReference) {
      navigator.clipboard.writeText(booking.bookingReference);
      showToast('Booking reference copied to clipboard!', 'success');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            Pending Review
          </span>
        );
      case 'Contacted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            Consultation In Progress
          </span>
        );
      case 'Quotation Sent':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">
            Quotation Prepared
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
            Confirmed Event
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 border border-gray-300">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-20 bg-ivory-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-maroon-950 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Enquiry Management & Tracking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50">
            Booking Confirmation & Status
          </h1>
          <p className="text-gold-200 text-sm sm:text-base font-light">
            Review your submission details, track quotation progress, or look up past event references.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Search Bar (if looking up another reference) */}
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 shadow-card-lux">
          <h3 className="font-serif text-base font-bold text-maroon-950 mb-3 flex items-center">
            <Search className="w-4 h-4 mr-2 text-gold-600" />
            <span>Track or Look Up a Booking Enquiry</span>
          </h3>
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Enter Reference (e.g. TE-2026-ABCDE)"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-sm hover:shadow-gold-glow transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-maroon-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Check Status</span>
              )}
            </button>
          </form>
        </div>

        {/* Booking Details Card */}
        {booking ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/40 shadow-card-lux space-y-8 print:shadow-none print:border-none">
            {/* Success Badge Header */}
            <div className="text-center pb-8 border-b border-gray-100 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center text-green-600 mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950">
                Booking Enquiry Recorded
              </h2>
              <p className="text-gray-600 text-sm max-w-lg mx-auto">
                Thank you, <strong>{booking.customerName}</strong>. Your celebration enquiry has been safely received by the TANYA EVENT'S planning desk.
              </p>

              {/* Reference Number Box */}
              <div className="pt-2">
                <div className="inline-flex items-center space-x-3 bg-maroon-950 text-white px-5 py-3 rounded-2xl border-2 border-gold-400 shadow-gold-glow">
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                      Your Unique Reference Code
                    </p>
                    <p className="font-cinzel text-xl sm:text-2xl font-bold text-ivory-50 tracking-wider">
                      {booking.bookingReference}
                    </p>
                  </div>
                  <button
                    onClick={copyReference}
                    className="p-2 rounded-lg bg-maroon-900 text-gold-300 hover:text-white transition"
                    title="Copy Reference"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center space-x-2">
                <span className="text-xs text-gray-500 font-medium">Live Status:</span>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            {/* Next Steps Guide */}
            <div className="p-5 rounded-2xl bg-ivory-100 border border-gold-500/30 space-y-2">
              <h4 className="font-serif font-bold text-maroon-950 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gold-700" />
                <span>What Happens Next?</span>
              </h4>
              <ol className="text-xs text-gray-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Our senior event coordinator reviews venue logistics and service availability for <strong>{booking.eventDate}</strong>.</li>
                <li>We will connect with you via mobile/WhatsApp (<strong>{booking.phone}</strong>) to finalize menu items and theme choices.</li>
                <li>You receive a detailed itemized quotation. Once approved, the event date is locked!</li>
              </ol>
            </div>

            {/* Quotation amount banner if already provided by admin */}
            {booking.quotationAmount && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-maroon-950 to-maroon-900 text-white border border-gold-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold bg-maroon-900 px-2.5 py-0.5 rounded">
                    Official Quotation Provided
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-ivory-50 mt-1">
                    ₹{booking.quotationAmount.toLocaleString('en-IN')}
                  </h4>
                  <p className="text-xs text-gray-300">
                    Calculated for {booking.guestCount} guests including selected infrastructure.
                  </p>
                </div>
                <a
                  href={`https://wa.me/917856831119?text=${encodeURIComponent(
                    `Hello Tanya Events, regarding quotation for reference ${booking.bookingReference}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gold-btn text-maroon-950 text-xs font-bold shadow-gold-glow flex items-center space-x-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Quotation</span>
                </a>
              </div>
            )}

            {/* Full Enquiry Summary Table */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-maroon-950">
                Enquiry Summary Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold">Event Type</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">{booking.eventType}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold">Event Date & Slot</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                    {booking.eventDate} ({booking.eventTime || 'Full Day'})
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold">Venue & Location</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                    {booking.venue}, {booking.city}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold">Guest Count & Budget</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                    {booking.guestCount} Guests • {booking.budget || 'Flexible'}
                  </span>
                </div>
              </div>

              {/* Selected Services */}
              <div className="pt-2">
                <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold mb-2">
                  Requested Services ({booking.services.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {booking.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 rounded-xl bg-ivory-50 border border-gold-500/20 text-xs font-semibold text-maroon-900 flex items-center justify-between"
                    >
                      <span>{srv.name}</span>
                      <span className="text-[11px] text-gold-700">Included</span>
                    </div>
                  ))}
                </div>
              </div>

              {booking.customerMessage && (
                <div className="pt-2">
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] font-semibold mb-1">
                    Your Vision / Special Instructions
                  </span>
                  <p className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed italic">
                    "{booking.customerMessage}"
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Summary</span>
              </button>

              <div className="flex items-center space-x-3">
                <a
                  href={`https://wa.me/917856831119?text=${encodeURIComponent(
                    `Hello Tanya Events, I would like to inquire about my booking reference: ${booking.bookingReference}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>

                <Link
                  to="/"
                  className="inline-flex items-center space-x-1 px-5 py-2.5 rounded-xl text-xs font-semibold text-maroon-900 bg-ivory-100 hover:bg-gold-100 border border-gold-500/30 transition"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : searched && !loading ? (
          <div className="bg-white rounded-3xl p-10 border border-red-200 text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-maroon-950">
              No Booking Found
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              We could not find an enquiry matching the reference code <strong>"{searchRef}"</strong>. Please verify the code or submit a fresh booking enquiry.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-bold text-maroon-950 bg-gold-btn"
            >
              <span>Submit a New Enquiry</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};
