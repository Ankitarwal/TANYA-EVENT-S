import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { settingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Event Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How far in advance should we book TANYA EVENT\'S for a wedding?',
      a: 'For royal weddings requiring waterproof German Hanger pandals and full catering, we recommend booking 2 to 6 months in advance, especially during the peak wedding season (October to March). Intimate events can often be accommodated on shorter notice.',
    },
    {
      q: 'Do you provide on-site catering food tasting before finalizing?',
      a: 'Yes, absolutely. Once an initial booking enquiry is reviewed and an event blueprint is agreed upon, we arrange an executive tasting session with our master chefs to curate your ideal multi-course menu.',
    },
    {
      q: 'Can you work at private farmhouses or personal open plots?',
      a: 'Yes! Our German hanger truss systems and shamiana pandals are engineered for complete off-grid stability, including leveling uneven grounds, all-weather waterproofing, generator power backup, and full kitchen infrastructure.',
    },
    {
      q: 'What is your payment and advance schedule?',
      a: 'Following your quotation approval, an initial advance secures your event date on our master production calendar. The balance is scheduled in structured milestones as site staging and catering procurement commence.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      showToast('Please fill in your name, phone number, and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await settingsApi.submitContact(formData);
      setSubmitted(true);
      showToast('Message sent! Our team will get back to you shortly.', 'success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'General Event Inquiry',
        message: '',
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-ivory-50 min-h-screen">
      {/* Banner */}
      <section className="bg-maroon-950 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Connect With Our Team</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50">
            Contact TANYA EVENT'S
          </h1>
          <p className="text-gold-200 text-sm sm:text-base font-light">
            We are here to assist with every question, schedule venue site surveys, and tailor your dream celebration.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Details Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-card-lux space-y-6">
              <h3 className="font-serif text-xl font-bold text-maroon-950">
                Corporate Office
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center shrink-0 text-gold-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">Office Address</span>
                    <span className="font-medium text-gray-800">
                      South point public school, Laxmi Market, Dr. Shambhu Sharan Prasad, New Jakkanpur, Gardanibagh, Patna, Bihar, India - 800001
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center shrink-0 text-gold-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">Direct Hotline</span>
                    <a href="tel:+917856831119" className="font-medium text-gray-800 hover:text-gold-700 transition">+91 78568 31119</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center shrink-0 text-gold-700">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">Email Inquiry</span>
                    <a href="mailto:tanyaevents.booking@gmail.com" className="font-medium text-gray-800 hover:text-gold-700 transition">
                      tanyaevents.booking@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center shrink-0 text-gold-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">Consultation Hours</span>
                    <span className="font-medium text-gray-800">Mon – Sun: 9:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Link Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/917856831119?text=Hello%20TANYA%20EVENTS,%20I%20would%20like%20to%20discuss%20an%20event."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Google Maps Visual Frame */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gold-500/30 shadow-card-lux">
              <div className="p-4 bg-maroon-950 text-white flex items-center justify-between">
                <span className="text-xs font-semibold text-gold-300">Office Location Map</span>
                <span className="text-[10px] text-gray-400">Patna, Bihar Headquarters</span>
              </div>
              <div className="h-56 bg-gray-200 relative flex items-center justify-center">
                <iframe
                  title="TANYA EVENT'S Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14392.215682855146!2d85.1189445!3d25.5976523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed586ae27e4369%3A0xe5a36371752b04c8!2sGardanibagh%2C%20Patna%2C%20Bihar%20800001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gold-500/30 shadow-card-lux">
              <div className="mb-6 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
                  Quick Message
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-950 mt-2">
                  Send Us an Inquiry
                </h2>
                <p className="text-gray-600 text-sm">
                  Have a question about pandal dimensions, catering packages, or dates? Drop us a note.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-green-900">
                    Message Successfully Sent!
                  </h3>
                  <p className="text-xs text-green-800 max-w-md mx-auto">
                    Thank you for reaching out to TANYA EVENT'S. One of our event coordinators will call or reply to your inquiry promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-green-900 underline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Meera Kapoor"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. meera@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none bg-white"
                      >
                        <option value="General Event Inquiry">General Event Inquiry</option>
                        <option value="Pandal & Waterproof Hanger Booking">Pandal & Waterproof Hanger Booking</option>
                        <option value="Catering & Menu Tasting Consultation">Catering & Menu Tasting Consultation</option>
                        <option value="Wedding Planning & Coordination">Wedding Planning & Coordination</option>
                        <option value="DJ Sound & Stage Lights Production">DJ Sound & Stage Lights Production</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      Your Message or Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Share details regarding dates, approximate guest count, venue address, or specific services needed..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-[1.01] transition disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Tanya Events</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="mt-12 bg-white rounded-3xl p-8 border border-gold-500/20 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-maroon-950 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-gold-600" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-maroon-950 hover:bg-ivory-50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gold-700 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2 bg-ivory-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
