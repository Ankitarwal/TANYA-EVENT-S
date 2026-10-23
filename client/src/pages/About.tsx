import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Utensils,
  PartyPopper,
  Flame,
} from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const About: React.FC = () => {
  const values = [
    {
      title: 'Aesthetic Grandeur',
      desc: 'We combine traditional Indian royal heritage with contemporary design sensibilities to create visual wonder in every mandap, pandal, and hall.',
      icon: <Sparkles className="w-6 h-6 text-gold-500" />,
    },
    {
      title: 'Culinary Perfection',
      desc: 'Food is the soul of any celebration. Our catering emphasizes authentic flavors, premium ingredients, live counters, and uncompromising hygiene.',
      icon: <Utensils className="w-6 h-6 text-gold-500" />,
    },
    {
      title: 'Absolute Transparency',
      desc: 'We pride ourselves on transparent, itemized quotations. No hidden surcharges or surprise costs on your special day.',
      icon: <ShieldCheck className="w-6 h-6 text-gold-500" />,
    },
    {
      title: 'Flawless Time Management',
      desc: 'From baraat reception to varmala timing and dining service, our field coordinators manage strict schedules so you enjoy peace of mind.',
      icon: <Clock className="w-6 h-6 text-gold-500" />,
    },
  ];

  const celebrationTypes = [
    'Royal Indian Weddings & Mandap Ceremonies',
    'Pre-Wedding Rituals (Haldi, Mehendi, Sangeet)',
    'Grand Reception Pandals & Truss Marquees',
    'Milestone Anniversaries & Birthday Galas',
    'Community Festivals & Religious Pandals',
    'Corporate Conclaves & Annual Celebrations',
  ];

  return (
    <div className="pt-24 pb-20 bg-ivory-50">
      {/* Page Header */}
      <section className="bg-maroon-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-900/90 to-maroon-950/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Our Heritage & Vision</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ivory-50">
            About TANYA EVENT'S
          </h1>
          <p className="max-w-2xl mx-auto text-gold-200 text-lg font-light italic">
            "Making Every Celebration Unforgettable"
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
                Our Commitment to Excellence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950 leading-tight">
                Crafting Meaningful Celebrations With Heart & Precision
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                At <strong>TANYA EVENT'S</strong>, we believe every wedding and celebration is a once-in-a-lifetime tapestry of emotions, traditions, and togetherness. Founded with a vision to deliver turnkey event management under a single trustworthy banner, we integrate grand pandal infrastructure, bespoke wedding curation, gourmet catering, artistic floral decor, and high-energy sound engineering.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                Unlike fragmented vendor setups where families are forced to coordinate with multiple independent contractors, TANYA EVENT'S provides seamless, synchronized execution. When the varmala begins, our audio engineers, light designers, and stage crews operate in perfect concert.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-gold-500/20 shadow-sm">
                  <h4 className="font-serif font-bold text-maroon-900 text-lg">Single-Source</h4>
                  <p className="text-xs text-gray-600 mt-1">Pandal, catering, decor, and DJ under unified coordination.</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gold-500/20 shadow-sm">
                  <h4 className="font-serif font-bold text-maroon-900 text-lg">Tailored Design</h4>
                  <p className="text-xs text-gray-600 mt-1">Personalized themes reflecting your family's distinct aesthetic.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border-2 border-gold-500/30 shadow-card-lux">
                <ImageWithFallback
                  src="/images/service_pandal.jpg"
                  alt="Tanya Events Grand Setup"
                  className="w-full h-[450px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-maroon-950 text-white p-6 rounded-2xl border border-gold-500/40 shadow-xl max-w-xs hidden sm:block">
                <p className="font-serif text-gold-300 font-bold text-lg mb-1">
                  Royal Hospitality
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Every guest welcomed with warmth, dignity, and attentive culinary care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              The Values That Drive Us
            </h2>
            <p className="text-gray-600 text-base">
              Principles embedded in every booking enquiry, consultation, and event floor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-ivory-50 p-6 rounded-2xl border border-gold-500/20 shadow-sm hover:shadow-gold-glow transition"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h3 className="font-serif font-bold text-maroon-950 text-lg mb-2">
                  {v.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events We Manage */}
      <section className="py-20 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
              Events We Orchestrate
            </h2>
            <p className="text-gray-600 text-sm">
              We cater to celebrations of all scales with customized layouts and specialized staff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {celebrationTypes.map((type, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gold-500/20 shadow-sm"
              >
                <CheckCircle className="w-5 h-5 text-gold-600 shrink-0" />
                <span className="text-sm font-medium text-gray-800">{type}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/book"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
            >
              <Calendar className="w-4 h-4 mr-1" />
              <span>Discuss Your Upcoming Event</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
