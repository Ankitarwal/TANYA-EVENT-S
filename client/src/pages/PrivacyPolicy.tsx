import React from 'react';
import { ShieldCheck, Lock, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-ivory-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold text-gold-700 hover:text-maroon-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Return to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/20 shadow-card-lux space-y-8">
          <div className="border-b border-gray-100 pb-6 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              Legal & Data Privacy
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-500">
              Effective Date: January 1, 2026 • Last Updated: October 2026
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                1. Information We Collect
              </h2>
              <p>
                When you submit an event booking enquiry or contact request on <strong>TANYA EVENT'S</strong>, we collect relevant information necessary to tailor and coordinate your event services:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-gray-600">
                <li>Personal identification: Full Name, Indian Mobile Number, and Email Address.</li>
                <li>Event specifics: Event Type, Event Date, Planned Venue, City, and Expected Guest Count.</li>
                <li>Custom preferences: Service selections, estimated budget tier, and custom vision messages.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                2. How We Use Your Information
              </h2>
              <p>
                Your submitted contact information is utilized exclusively for genuine event management operations:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-gray-600">
                <li>Preparing and issuing customized, itemized event quotations.</li>
                <li>Contacting you via mobile phone or WhatsApp to discuss catering menus, pandal dimensions, and theme logistics.</li>
                <li>Tracking the operational status of your booking reference on our platform.</li>
                <li>We do not sell, rent, or trade your personal data to any external telemarketers or third-party advertisers.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                3. Data Security & Storage
              </h2>
              <p>
                All booking records are stored in secure, authenticated relational databases with restricted administrative access. Passwords and administrative credentials utilize industry-standard cryptographic hashing (bcrypt) and encrypted JSON Web Tokens.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                4. Your Rights
              </h2>
              <p>
                You may request a copy of your stored enquiry details or ask for your personal data to be removed from our records at any time by contacting us at <strong>tanyaevents.booking@gmail.com</strong> with your Booking Reference number.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                5. Contacting the Data Protection Officer
              </h2>
              <p>
                For questions regarding this policy, please reach out to our administration desk at South point public school, Laxmi Market, Dr. Shambhu Sharan Prasad, New Jakkanpur, Gardanibagh, Patna, Bihar, India - 800001, or call +91 78568 31119.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
