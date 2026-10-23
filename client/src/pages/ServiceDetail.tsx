import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Check,
  Calendar,
  ShieldCheck,
  Star,
  Info,
  ChevronRight,
} from 'lucide-react';
import { servicesApi } from '../services/api';
import { Service, Package } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await servicesApi.getBySlug(slug);
        setService(data);
      } catch (err: any) {
        setError(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading service specifications...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-32 pb-20 max-w-2xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-maroon-950">Service Not Found</h2>
        <p className="text-gray-600">The requested service could not be located.</p>
        <Link
          to="/services"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gold-600 hover:text-maroon-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-ivory-50">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gold-500/20 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-gold-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className="hover:text-gold-600">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-maroon-950 font-semibold">{service.name}</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative bg-maroon-950 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-950/90 to-maroon-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/services"
            className="inline-flex items-center text-xs font-semibold text-gold-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to All Services</span>
          </Link>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-50">
            {service.name}
          </h1>
          <p className="max-w-3xl text-gold-100 text-base sm:text-lg font-light leading-relaxed">
            {service.shortDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to={`/book?service=${service.id}`}
              className="inline-flex items-center px-7 py-3 rounded-full text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Book This Service Now</span>
            </Link>

            {service.startingPrice && (
              <span className="text-sm font-semibold text-gold-300 bg-maroon-900/80 px-4 py-2 rounded-full border border-gold-500/30">
                Starting from ₹{service.startingPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Description & Package Options */}
            <div className="lg:col-span-2 space-y-12">
              {/* Full Description & Showcase */}
              <div className="bg-white p-8 rounded-3xl border border-gold-500/20 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-maroon-950">
                  Detailed Service Overview
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {service.description}
                </p>

                <div className="rounded-2xl overflow-hidden border border-gold-500/30 shadow-md">
                  <ImageWithFallback
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-[360px] object-cover"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="font-serif text-lg font-bold text-maroon-950 mb-4">
                    What Makes Our {service.name} Unique
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start p-3 rounded-xl bg-ivory-50 border border-gold-500/10 text-xs text-gray-800"
                      >
                        <Check className="w-4 h-4 text-gold-600 mr-2 shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Package Options */}
              {service.packages && service.packages.length > 0 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
                      Tier Options
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-maroon-950 mt-2">
                      Available Package Configurations
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      (Configurable starting estimates. Exact quotation provided upon venue review.)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {service.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`rounded-2xl p-6 flex flex-col justify-between border transition ${
                          pkg.isPopular
                            ? 'bg-gradient-to-b from-maroon-950 to-maroon-900 text-white border-gold-400 shadow-gold-glow relative'
                            : 'bg-white text-gray-900 border-gold-500/30 shadow-sm'
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-3 right-6 bg-gold-500 text-maroon-950 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                            Most Popular
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <h3 className={`font-serif text-xl font-bold ${pkg.isPopular ? 'text-gold-200' : 'text-maroon-950'}`}>
                              {pkg.name}
                            </h3>
                            <p className={`text-xs mt-1 ${pkg.isPopular ? 'text-gray-300' : 'text-gray-600'}`}>
                              {pkg.description}
                            </p>
                          </div>

                          {pkg.price && (
                            <div className="pt-2 border-t border-gray-100/20">
                              <span className={`text-2xl font-bold ${pkg.isPopular ? 'text-white' : 'text-maroon-950'}`}>
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                              <span className={`text-xs ml-1 ${pkg.isPopular ? 'text-gold-300' : 'text-gray-500'}`}>
                                {service.slug === 'catering-services' ? '/ guest estimate' : 'est. starting base'}
                              </span>
                            </div>
                          )}

                          <div className="space-y-2 pt-2">
                            <p className={`text-[11px] uppercase tracking-wider font-semibold ${pkg.isPopular ? 'text-gold-300' : 'text-maroon-800'}`}>
                              Included Highlights:
                            </p>
                            {pkg.features.map((feat, i) => (
                              <div key={i} className="flex items-start text-xs">
                                <Check className={`w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 ${pkg.isPopular ? 'text-gold-400' : 'text-gold-600'}`} />
                                <span className={pkg.isPopular ? 'text-gray-200' : 'text-gray-700'}>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-200/20">
                          <Link
                            to={`/book?service=${service.id}&package=${encodeURIComponent(pkg.name)}`}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold text-center block transition ${
                              pkg.isPopular
                                ? 'bg-gold-btn text-maroon-950 hover:shadow-gold-glow'
                                : 'bg-maroon-900 text-white hover:bg-maroon-800'
                            }`}
                          >
                            Select & Request Quote
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Booking Assistant & Support */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-card-lux sticky top-28 space-y-5">
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-gold-700" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-maroon-950">
                    Book {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Lock in your event date with zero immediate obligation.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-gold-600" />
                    <span>Free on-site consultation & venue measurement</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-gold-600" />
                    <span>Itemized transparent quotation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-gold-600" />
                    <span>Customized themes & dietary accommodations</span>
                  </div>
                </div>

                <Link
                  to={`/book?service=${service.id}`}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-maroon-950 bg-gold-btn shadow-gold-glow block text-center transition hover:scale-[1.02]"
                >
                  Proceed to Booking Form
                </Link>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-gray-500">Need quick answers first?</p>
                  <a
                    href="https://wa.me/917856831119"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-gold-700 hover:text-maroon-900 mt-1 inline-block"
                  >
                    Chat on WhatsApp with Event Director →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
