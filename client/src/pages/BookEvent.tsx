import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Phone,
  Mail,
  User,
  MapPin,
  Users,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { servicesApi, bookingsApi } from '../services/api';
import { Service, BookingFormData } from '../types';
import { useToast } from '../context/ToastContext';

export const BookEvent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const preselectedServiceId = searchParams.get('service');
  const preselectedPackage = searchParams.get('package');

  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    services: preselectedServiceId ? [preselectedServiceId] : ['srv-pandal', 'srv-wedding'],
    eventDate: '',
    eventTime: 'Evening',
    venue: '',
    city: '',
    guestCount: 300,
    budget: '₹2,50,000 - ₹5,00,000',
    packagePreference: preselectedPackage || 'Custom Combination',
    customerMessage: '',
    privacyAccepted: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Minimum date: tomorrow
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setAvailableServices(data);

        // If preselected service was specified, ensure it is selected
        if (preselectedServiceId) {
          setFormData((prev) => ({
            ...prev,
            services: Array.from(new Set([...prev.services, preselectedServiceId])),
          }));
        }
      } catch (err) {
        console.error('Error fetching services for booking form:', err);
      }
    };

    loadServices();
  }, [preselectedServiceId]);

  const eventTypes = [
    'Wedding',
    'Reception',
    'Engagement',
    'Haldi / Sangeet / Mehendi',
    'Anniversary / Birthday Celebration',
    'Pandal / Religious Congregation',
    'Corporate Gala / Conference',
    'Other Special Event',
  ];

  const timeSlots = ['Full Day', 'Morning (8 AM – 2 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening & Night (6 PM – Midnight)'];

  const budgetRanges = [
    'Under ₹1,00,000',
    '₹1,00,000 - ₹2,50,000',
    '₹2,50,000 - ₹5,00,000',
    '₹5,00,000 - ₹10,00,000',
    '₹10,00,000+',
    'Flexible / Seeking Consultation',
  ];

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceId);
      const updated = exists
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });

    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[- ]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!formData.phone || !phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Please select your event type.';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one required service.';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Please select your planned event date.';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past.';
      }
    }

    if (!formData.venue.trim() || formData.venue.trim().length < 3) {
      newErrors.venue = 'Please specify the venue or locality.';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = 'Please enter the city for the event.';
    }

    if (!formData.guestCount || Number(formData.guestCount) <= 0) {
      newErrors.guestCount = 'Please specify expected guest count (minimum 1).';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must agree to our privacy terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast('Please correct the highlighted errors in the form.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await bookingsApi.submit(formData);
      showToast('Enquiry received! Booking reference generated.', 'success');
      navigate(`/booking-confirmation/${result.booking.bookingReference}`);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      showToast(err.message || 'Failed to submit booking enquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-ivory-50">
      {/* Banner */}
      <section className="bg-maroon-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-900/90 to-maroon-950/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Direct Event Reservation Enquiry</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50">
            Book Your Event With TANYA EVENT'S
          </h1>
          <p className="max-w-2xl mx-auto text-gold-200 text-base sm:text-lg font-light">
            Fill in your celebration requirements below. Our Senior Event Director will review your details, verify schedule logistics, and provide a comprehensive quotation.
          </p>
        </div>
      </section>

      {/* Booking Form Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold-500/30 shadow-card-lux">
          {/* Status Note */}
          <div className="mb-8 p-4 rounded-2xl bg-gold-50/80 border border-gold-300 flex items-start space-x-3 text-xs text-gray-700">
            <ShieldCheck className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-maroon-950 text-sm mb-0.5">
                Transparent Booking Workflow
              </p>
              <p className="leading-relaxed">
                Submitting this form records your enquiry as <strong>Pending</strong>. You will receive an instant unique Booking Reference code to track your status. Our team will contact you within 24 hours with an itemized quotation before any financial commitment.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Step 1: Customer Details */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-maroon-950 flex items-center">
                <span className="w-7 h-7 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center text-xs mr-2 font-cinzel">1</span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.customerName
                          ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                          : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                      }`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile Number (India) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="10-digit mobile (e.g. 9876543210)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                          : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Address (Optional) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-gray-400 font-normal">(Optional for Quotation PDF)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. rajesh.kumar@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Event Specifics */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h2 className="font-serif text-xl font-bold text-maroon-950 flex items-center">
                <span className="w-7 h-7 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center text-xs mr-2 font-cinzel">2</span>
                <span>Event Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Event Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none bg-white"
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Event Date <span className="text-red-500">*</span>
                    <span className="text-[11px] text-gray-500 ml-1 font-normal">(Subject to confirmation)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      min={getMinDate()}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.eventDate
                          ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                          : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                      }`}
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                {/* Event Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Event Time / Slot
                  </label>
                  <select
                    value={formData.eventTime || 'Evening & Night'}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expected Guests */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Expected Number of Guests <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="number"
                      min="10"
                      step="10"
                      placeholder="e.g. 400"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none"
                    />
                  </div>
                  {errors.guestCount && (
                    <p className="text-red-500 text-xs mt-1 text-red-500">{errors.guestCount}</p>
                  )}
                </div>

                {/* Venue / Locality */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Venue / Farmhouse / Hall Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Royal Palace Lawn, MG Road"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                        errors.venue
                          ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                          : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                      }`}
                    />
                  </div>
                  {errors.venue && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.venue}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi, Noida, Gurgaon, Patna"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                      errors.city
                        ? 'border-red-400 focus:ring-red-200 bg-red-50/30'
                        : 'border-gray-300 focus:border-gold-500 focus:ring-gold-100'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Required Services (Multi-select) */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-maroon-950 flex items-center">
                  <span className="w-7 h-7 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center text-xs mr-2 font-cinzel">3</span>
                  <span>Required Services <span className="text-red-500 ml-1">*</span></span>
                </h2>
                <span className="text-xs text-gray-500">Select all that apply</span>
              </div>

              {errors.services && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                  {errors.services}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableServices.map((service) => {
                  const isChecked = formData.services.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition flex items-start space-x-3 ${
                        isChecked
                          ? 'bg-maroon-950 text-white border-gold-400 shadow-md'
                          : 'bg-ivory-50 text-gray-800 border-gray-200 hover:border-gold-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by wrapper click
                        className="mt-1 h-4 w-4 rounded text-gold-600 focus:ring-gold-500 cursor-pointer accent-gold-500"
                      />
                      <div>
                        <p className={`text-sm font-semibold ${isChecked ? 'text-gold-200' : 'text-maroon-950'}`}>
                          {service.name}
                        </p>
                        <p className={`text-xs mt-0.5 line-clamp-2 ${isChecked ? 'text-gray-300' : 'text-gray-500'}`}>
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Budget & Package Preference */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h2 className="font-serif text-xl font-bold text-maroon-950 flex items-center">
                <span className="w-7 h-7 rounded-full bg-maroon-900 text-gold-300 flex items-center justify-center text-xs mr-2 font-cinzel">4</span>
                <span>Budget & Requirements</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Estimated Budget Range
                  </label>
                  <select
                    value={formData.budget || '₹2,50,000 - ₹5,00,000'}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none bg-white"
                  >
                    {budgetRanges.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Package Preference <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Royale or Custom"
                    value={formData.packagePreference || ''}
                    onChange={(e) => setFormData({ ...formData, packagePreference: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none"
                  >
                  </input>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Specific Vision, Menu Preferences, or Instructions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your theme, vegetarian/non-vegetarian preferences, varmala entry concept, stage dimensions, or specific questions..."
                    value={formData.customerMessage || ''}
                    onChange={(e) => setFormData({ ...formData, customerMessage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-gold-500 focus:ring-2 focus:ring-gold-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Consent */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-gold-600 focus:ring-gold-500 accent-gold-500 cursor-pointer"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  I agree that TANYA EVENT'S may use my submitted contact details exclusively to provide an itemized event quotation, discuss planning logistics, and coordinate my booking request. (Read our <Link to="/privacy-policy" className="text-gold-700 underline">Privacy Policy</Link>).
                </span>
              </label>
              {errors.privacyAccepted && (
                <p className="text-red-500 text-xs">{errors.privacyAccepted}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl text-base font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-[1.01] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-maroon-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Booking Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Submit Event Booking Enquiry</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-500 mt-2">
                🔒 Safe & Confidential. No payment required at this initial enquiry stage.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
