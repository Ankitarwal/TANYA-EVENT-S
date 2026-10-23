import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Check,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Info,
  HelpCircle,
} from 'lucide-react';

export const Packages: React.FC = () => {
  const [guestCount, setGuestCount] = useState<number>(350);

  const tiers = [
    {
      name: 'Silver Celebration',
      tagline: 'Ideal for intimate weddings, engagements, or home functions',
      basePrice: '₹1,50,000',
      badge: 'Intimate Gathering',
      isPopular: false,
      features: [
        'Traditional Shamiana / Pandal setup (up to 250 guests)',
        'Stage backdrop with fresh seasonal floral accents',
        'Standard banquet seating with covers & ties',
        'Ambient lighting & entry arch',
        'Basic sound system with party playlist coordination',
        'Single lead coordinator on event day',
      ],
      suitableGuests: 'Up to 250 guests',
    },
    {
      name: 'Gold Royale',
      tagline: 'Our most sought-after royal wedding & reception package',
      basePrice: '₹3,75,000',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'Waterproof German Hanger Pandal (5,000 sq ft)',
        'Royal Gold Chiavari chairs & VIP family sofa lounge',
        'Grand 4-pillar carved mandap with red roses & orchids',
        'Full fairy light ceiling canopy & crystal chandeliers',
        'Dual line-array sound system + moving-head beam lights',
        'Dry ice heavy smoke & cold pyro sparks for grand entry',
        'Dedicated Event Director + 3 field supervisors',
      ],
      suitableGuests: '300 to 700 guests',
    },
    {
      name: 'Platinum Imperial',
      tagline: 'Turnkey luxury production for grand multi-day weddings',
      basePrice: '₹7,50,000',
      badge: 'Turnkey Luxury',
      isPopular: false,
      features: [
        'Concert-scale German hanger with climate control infrastructure',
        '3D designed palace stage & royal mandap installation',
        'Full 3-day multi-ritual coordination (Haldi, Sangeet, Wedding)',
        'Artisan gourmet catering management with live live-counters',
        'Interactive LED dance floor & club-tier moving heads',
        'Celebrity DJ & live Punjabi dhol troupe',
        'Senior Event Architect + 6 dedicated operational staff',
      ],
      suitableGuests: '600 to 1,500+ guests',
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-ivory-50">
      {/* Banner */}
      <section className="bg-maroon-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-900/90 to-maroon-950/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Transparent Event Estimates</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ivory-50">
            Curated Event Packages
          </h1>
          <p className="max-w-2xl mx-auto text-gold-200 text-lg font-light">
            Flexible, scalable package blueprints designed to simplify your planning while offering complete customization for your family.
          </p>
        </div>
      </section>

      {/* Pricing Disclaimer Alert */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gold-500/30 shadow-sm flex items-start space-x-3 text-xs text-gray-700">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-maroon-950 text-sm mb-1">
              Note on Quotations & Business Transparency
            </p>
            <p className="leading-relaxed">
              The figures below represent typical starting baseline estimates for comprehensive package configurations. Every event is uniquely customized according to your exact venue dimensions, city logistics, guest count, and specific culinary preferences. We provide exact, binding quotations upon your enquiry submission.
            </p>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 ${
                tier.isPopular
                  ? 'bg-gradient-to-b from-maroon-950 to-maroon-900 text-white border-gold-400 shadow-gold-glow relative scale-105 z-10'
                  : 'bg-white text-gray-900 border-gold-500/30 shadow-card-lux'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-maroon-950 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                    tier.isPopular ? 'bg-maroon-900 text-gold-300' : 'bg-gold-100 text-maroon-900'
                  }`}>
                    {tier.badge}
                  </span>
                  <h3 className={`font-serif text-2xl font-bold mt-2 ${tier.isPopular ? 'text-ivory-50' : 'text-maroon-950'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 ${tier.isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tier.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100/20">
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-3xl sm:text-4xl font-bold ${tier.isPopular ? 'text-white' : 'text-maroon-950'}`}>
                      {tier.basePrice}
                    </span>
                    <span className={`text-xs ${tier.isPopular ? 'text-gold-300' : 'text-gray-500'}`}>
                      *starting estimate
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 font-medium ${tier.isPopular ? 'text-gold-300' : 'text-gold-700'}`}>
                    {tier.suitableGuests}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100/20">
                  <p className={`text-xs uppercase tracking-wider font-bold ${tier.isPopular ? 'text-gold-300' : 'text-maroon-900'}`}>
                    Key Package Inclusions:
                  </p>
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start text-xs">
                      <Check className={`w-4 h-4 mr-2.5 shrink-0 mt-0.5 ${tier.isPopular ? 'text-gold-400' : 'text-gold-600'}`} />
                      <span className={tier.isPopular ? 'text-gray-200' : 'text-gray-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100/20">
                <Link
                  to={`/book?package=${encodeURIComponent(tier.name)}`}
                  className={`w-full py-3.5 rounded-full text-xs font-bold text-center block transition transform hover:scale-105 ${
                    tier.isPopular
                      ? 'bg-gold-btn text-maroon-950 shadow-gold-glow'
                      : 'bg-maroon-900 text-white hover:bg-maroon-800'
                  }`}
                >
                  Choose {tier.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom A La Carte Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center bg-white rounded-3xl border border-gold-500/20 shadow-card-lux">
        <h3 className="font-serif text-2xl font-bold text-maroon-950 mb-3">
          Need a Tailored A-La-Carte Combination?
        </h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-6">
          You are never forced into a fixed package. Whether you only need Catering for 800 guests, or exclusively a waterproof German Hanger Pandal, or just DJ & Sound — we customize every order.
        </p>
        <Link
          to="/book"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
        >
          <Calendar className="w-4 h-4 mr-1" />
          <span>Build Your Custom Booking Enquiry</span>
        </Link>
      </section>
    </div>
  );
};
