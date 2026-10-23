import React from 'react';
import { ArrowLeft, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsConditions: React.FC = () => {
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
              Contractual Guidelines
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-500">
              Effective Date: January 1, 2026 • TANYA EVENT'S Management
            </p>
          </div>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                1. Quotations & Enquiry Status
              </h2>
              <p>
                Online submission of an event booking form registers an initial enquiry with status <strong>Pending</strong>. It does not constitute a guaranteed reservation or binding contract until an itemized quotation is formally signed and the designated booking advance is remitted.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                2. Date Reservation & Advances
              </h2>
              <p>
                To officially lock an event date on our master calendar, an advance deposit (typically 30% of total quotation value) is required. The remaining payments are divided across agreed operational milestones leading up to the final event day.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                3. Venue Logistics & Permissions
              </h2>
              <p>
                The client is responsible for procuring municipal sound permissions, venue access approvals, and any designated parking clearances unless specifically contracted to TANYA EVENT'S in writing. For pandal and hanger construction, unimpeded access to the site at least 24 to 48 hours prior to the event is mandatory.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                4. Cancellation & Date Postponement
              </h2>
              <p>
                In the event of cancellation:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-gray-600">
                <li>Cancellations more than 45 days prior to event date: 70% refund of advance deposit.</li>
                <li>Cancellations between 15 to 45 days: 30% refund, or credit transferred to an alternative mutual date within 6 months.</li>
                <li>Cancellations under 15 days: Non-refundable due to vendor lock-in, floral orders, and perishable food procurement.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-xl font-bold text-maroon-950">
                5. Force Majeure
              </h2>
              <p>
                Neither party shall be held liable for failure or delay in event performance resulting from acts of God, extreme natural disasters, government lockdowns, or riot emergencies. In such scenarios, both parties agree to reschedule the event in good faith.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
