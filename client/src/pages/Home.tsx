import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  Palette,
  Users2,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  MessageSquareText,
  DollarSign,
  PartyPopper,
  Quote,
  Eye,
} from 'lucide-react';
import { servicesApi, galleryApi } from '../services/api';
import { Service, GalleryItem } from '../types';
import { ServiceCard } from '../components/ServiceCard';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, galleryData] = await Promise.all([
          servicesApi.getAll(),
          galleryApi.getAll('All'),
        ]);
        setServices(servicesData);
        setFeaturedGallery(galleryData.slice(0, 6));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const whyChooseUsPoints = [
    {
      title: 'Customized Event Planning',
      desc: 'Every celebration is tailored from scratch to honor your unique family traditions, personal taste, and event vision.',
      icon: <Users2 className="w-6 h-6 text-gold-400" />,
    },
    {
      title: 'Quality Food & Catering',
      desc: 'Gourmet vegetarian and multi-cuisine spreads prepared with fresh ingredients, live counters, and highest hygiene standards.',
      icon: <UtensilsCrossed className="w-6 h-6 text-gold-400" />,
    },
    {
      title: 'Creative Decorations',
      desc: 'Bespoke floral mandaps, fairy light tunnels, architectural backdrops, and photogenic stage architecture.',
      icon: <Palette className="w-6 h-6 text-gold-400" />,
    },
    {
      title: 'Professional Event Support',
      desc: 'Dedicated on-site coordinators, sound technicians, and catering supervisors ensuring zero hassle for your family.',
      icon: <ShieldCheck className="w-6 h-6 text-gold-400" />,
    },
    {
      title: 'Transparent Quotations',
      desc: 'Clear itemized proposals without hidden costs. You receive a complete breakdown before making any commitment.',
      icon: <FileSpreadsheet className="w-6 h-6 text-gold-400" />,
    },
    {
      title: 'Attention to Detail',
      desc: 'From VIP seating comfort to punctual banquet timing and stage cues, no small detail is ever left to chance.',
      icon: <CheckCircle2 className="w-6 h-6 text-gold-400" />,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Choose Your Service',
      desc: 'Select from Pandal & Caterers, Wedding Planning, Catering, Decor, or DJ Services.',
      icon: <CheckCircle2 className="w-5 h-5 text-gold-400" />,
    },
    {
      num: '02',
      title: 'Submit Booking Enquiry',
      desc: 'Share your event date, expected guest count, venue, and specific preferences.',
      icon: <Calendar className="w-5 h-5 text-gold-400" />,
    },
    {
      num: '03',
      title: 'Discuss Your Requirements',
      desc: 'Our event director consults with you to fine-tune menu tastings, themes, and schedules.',
      icon: <MessageSquareText className="w-5 h-5 text-gold-400" />,
    },
    {
      num: '04',
      title: 'Receive Your Quotation',
      desc: 'Get a comprehensive itemized quotation aligned with your guest count and budget.',
      icon: <DollarSign className="w-5 h-5 text-gold-400" />,
    },
    {
      num: '05',
      title: 'Confirm Your Event',
      desc: 'Lock in your dates and sit back as we bring your dream celebration to life.',
      icon: <PartyPopper className="w-5 h-5 text-gold-400" />,
    },
  ];

  const sampleTestimonials = [
    {
      name: 'Rajesh & Sunita Sharma',
      event: 'Daughter\'s Wedding Reception (550 Guests)',
      quote:
        'The German hanger pandal and royal maroon decor created by Tanya Events left our entire family awestruck. The catering was praised by every single guest. Truly professional execution.',
      badge: 'Sample Client Experience',
    },
    {
      name: 'Vikram & Ananya Malhotra',
      event: 'Sangeet & Varmala Ceremony (400 Guests)',
      quote:
        'The DJ sound system, moving head lights, and dry-ice cold pyro entry for the varmala was straight out of a Bollywood fairytale! Flawless coordination from start to finish.',
      badge: 'Sample Client Experience',
    },
    {
      name: 'Deepak Singhania',
      event: '25th Wedding Anniversary Gala (300 Guests)',
      quote:
        'Transparent quotation from day one without any surprise charges. The live chaat counters and floral entrance arches were spectacular. Highly recommended for premium family events.',
      badge: 'Sample Client Experience',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/hero_mandap.jpg"
            alt="TANYA EVENT'S Royal Wedding Mandap"
            className="w-full h-full object-cover scale-105 filter brightness-90 transform animate-subtleZoom"
          />
          {/* Royal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/95 via-maroon-950/80 to-maroon-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8">
          <div className="inline-flex items-center space-x-2 bg-maroon-900/80 border border-gold-500/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-gold-glow animate-fadeIn">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="font-cinzel text-xs sm:text-sm tracking-widest text-gold-300 uppercase">
              TANYA EVENT'S • Making Every Celebration Unforgettable
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ivory-50 leading-tight">
            Your Dream Event, <br />
            <span className="text-gold-gradient italic">Our Perfect Execution</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-200 leading-relaxed font-light">
            From beautiful weddings to grand pandals, delicious catering, stunning decorations, and unforgettable DJ nights — we make every occasion special.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-maroon-950 bg-gold-btn rounded-full shadow-gold-glow transition transform hover:-translate-y-1 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Book Your Event</span>
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-maroon-900/60 hover:bg-maroon-800/80 border border-gold-500/40 rounded-full backdrop-blur-sm transition transform hover:-translate-y-1"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-5 h-5 ml-2 text-gold-400" />
            </Link>
          </div>

          {/* Quick Highlight Pills */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-gold-200/90 border-t border-gold-500/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 py-1">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>Pandal & Waterproof Hanger</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>Gourmet Royal Catering</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>Bespoke Floral Mandaps</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-1">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span>Pro DJ & Line-Array Sound</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Overview Section */}
      <section className="py-20 bg-ivory-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-maroon-800 text-xs uppercase tracking-widest font-semibold bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              <span>Comprehensive Event Solutions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
              Our Five Signature Services
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Everything required to orchestrate a seamless, royal celebration under one trusted roof.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-maroon-900 bg-white border border-gold-500/40 shadow-sm hover:shadow-gold-glow transition"
            >
              <span>View All Service Specifications & Menus</span>
              <ArrowRight className="w-4 h-4 text-gold-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="py-20 bg-maroon-950 text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-maroon-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-gold-300 text-xs uppercase tracking-widest font-semibold bg-maroon-900 px-3 py-1 rounded-full border border-gold-500/30">
              <span>Why Choose TANYA EVENT'S</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50">
              The Hallmarks of Our Event Excellence
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              We approach every event with the utmost dedication, ensuring your family celebrates without stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUsPoints.map((item, index) => (
              <div
                key={index}
                className="glass-card-dark p-8 rounded-2xl border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-maroon-900/80 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-gold-200 mb-3 group-hover:text-gold-100 transition">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Events Gallery Section */}
      <section className="py-20 bg-ivory-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-maroon-800 text-xs uppercase tracking-widest font-semibold bg-gold-200/60 px-3 py-1 rounded-full border border-gold-300 mb-3">
                <span>Visual Portfolio</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
                Featured Event Moments
              </h2>
              <p className="text-gray-600 text-base mt-2">
                A glimpse into royal mandaps, pandal structures, gourmet dining, and sangeet stages.
              </p>
            </div>
            <Link
              to="/gallery"
              className="mt-4 md:mt-0 inline-flex items-center text-sm font-semibold text-maroon-900 hover:text-gold-700 transition"
            >
              <span>Explore Complete Gallery</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden shadow-card-lux bg-maroon-950 aspect-[4/3]"
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 bg-maroon-900/80 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-1 group-hover:text-gold-200 transition">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-20 bg-white border-y border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-maroon-800 text-xs uppercase tracking-widest font-semibold bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              <span>Simple & Transparent</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
              How Planning Works With Us
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              A clear, 5-step journey from initial inquiry to flawless event day execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-ivory-50 rounded-2xl p-6 border border-gold-500/20 shadow-sm flex flex-col justify-between hover:border-gold-500 transition hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cinzel text-2xl font-bold text-gold-600">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-maroon-950 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/book"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
            >
              <Calendar className="w-4 h-4 mr-1" />
              <span>Start Step 1: Submit Booking Enquiry</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section (Clearly Marked Sample Reviews) */}
      <section className="py-20 bg-ivory-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-maroon-800 text-xs uppercase tracking-widest font-semibold bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
              <Quote className="w-3.5 h-3.5 text-gold-700" />
              <span>Client Perspectives</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950">
              Celebrations We Cherish
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              (Sample demo client reviews illustrating our commitment to quality)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-gold-500/20 shadow-card-lux flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-gold-500 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-gold-700 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <p className="font-serif font-bold text-maroon-950 text-base">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="relative py-24 bg-maroon-gradient text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ivory-50 leading-tight">
            Let's Make Your Special Day Extraordinary
          </h2>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-gold-100 font-light leading-relaxed">
            Whether you envision a grand royal pandal, an intimate mandap wedding, or gourmet catering for your guests, our directors are ready to assist.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 text-base font-bold text-maroon-950 bg-gold-btn rounded-full shadow-gold-glow hover:scale-105 transition"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Plan Your Event Today</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-maroon-900/80 hover:bg-maroon-800 border border-gold-500/40 rounded-full transition"
            >
              <span>Speak With Our Team</span>
              <ArrowRight className="w-5 h-5 ml-2 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
