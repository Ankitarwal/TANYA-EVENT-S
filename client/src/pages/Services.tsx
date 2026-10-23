import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
  Tent,
  Heart,
  UtensilsCrossed,
  Palette,
  Volume2,
  Info,
} from 'lucide-react';
import { servicesApi } from '../services/api';
import { Service } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data);
      } catch (err) {
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'pandal-and-caterers':
        return <Tent className="w-5 h-5 text-gold-500" />;
      case 'wedding-planning':
        return <Heart className="w-5 h-5 text-gold-500" />;
      case 'catering-services':
        return <UtensilsCrossed className="w-5 h-5 text-gold-500" />;
      case 'decoration-services':
        return <Palette className="w-5 h-5 text-gold-500" />;
      case 'dj-and-sound':
        return <Volume2 className="w-5 h-5 text-gold-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-gold-500" />;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-ivory-50">
      {/* Page Banner */}
      <section className="bg-maroon-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950 via-maroon-900/90 to-maroon-950/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-maroon-900 border border-gold-500/30 px-4 py-1.5 rounded-full text-gold-300 text-xs tracking-widest uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Turnkey Event Capabilities</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-ivory-50">
            Our Signature Services
          </h1>
          <p className="max-w-3xl mx-auto text-gold-200 text-lg font-light">
            From regal pandal architecture to fine dining catering, exquisite mandaps, and electrifying sound — explore what makes TANYA EVENT'S exceptional.
          </p>
        </div>
      </section>

      {/* Services List with Detailed Blocks */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-gray-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            services.map((service, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Image Column */}
                  <div className={`relative ${isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/30 shadow-card-lux group">
                      <ImageWithFallback
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-transparent to-transparent" />
                      {service.startingPrice && (
                        <div className="absolute top-4 left-4 bg-maroon-950/90 backdrop-blur-md border border-gold-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gold-300">
                          Starting from ₹{service.startingPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Content Column */}
                  <div className={`space-y-6 ${isEven ? 'lg:col-start-1' : ''}`}>
                    <div className="inline-flex items-center space-x-2 bg-gold-100 border border-gold-300 px-3 py-1 rounded-full text-xs font-semibold text-maroon-900">
                      {getServiceIcon(service.slug)}
                      <span>Pillar {index + 1} of 5</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-maroon-950">
                      {service.name}
                    </h2>

                    <p className="text-gray-700 text-base leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-maroon-900">
                          Key Inclusions & Highlights:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start text-xs text-gray-700">
                              <Check className="w-4 h-4 text-gold-600 mr-2 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-semibold text-maroon-900 bg-white border border-gold-500/40 shadow-sm hover:bg-gold-50 transition"
                      >
                        <span>View Details & Packages</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-gold-700" />
                      </Link>

                      <Link
                        to={`/book?service=${service.id}`}
                        className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-maroon-950 bg-gold-btn shadow-gold-glow hover:scale-105 transition"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        <span>Book {service.name}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Note on Pricing & Configurable Data */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 border border-gold-500/30 flex items-start space-x-4 text-xs text-gray-600 shadow-sm">
          <Info className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Custom Quotation Note:</strong> All package prices, itemized menus, and structural requirements vary depending on your specific venue size, guest count, and seasonal availability. Please submit a booking enquiry to receive an official, customized quotation tailored specifically to your date.
          </p>
        </div>
      </section>
    </div>
  );
};
