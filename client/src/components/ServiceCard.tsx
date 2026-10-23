import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Service } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gold-500/20 shadow-card-lux hover:shadow-gold-glow transition-all duration-300 flex flex-col transform hover:-translate-y-1.5">
      {/* Service Image with overlay */}
      <div className="relative h-60 sm:h-64 overflow-hidden">
        <ImageWithFallback
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-950/20 to-transparent" />

        {/* Starting Price Pill */}
        {service.startingPrice && (
          <div className="absolute top-4 right-4 bg-maroon-950/90 backdrop-blur-md border border-gold-500/40 px-3 py-1 rounded-full text-xs font-semibold text-gold-300 shadow-md">
            Starting from ₹{service.startingPrice.toLocaleString('en-IN')}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 bg-maroon-900/80 px-2 py-0.5 rounded">
            Service Pillar
          </span>
          <h3 className="font-serif text-2xl font-bold text-white mt-1 group-hover:text-gold-200 transition">
            {service.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {service.shortDescription || service.description}
          </p>

          {/* Features Highlights */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {service.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start text-xs text-gray-700">
                  <Check className="w-3.5 h-3.5 text-gold-600 mr-2 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-maroon-900 bg-ivory-100 hover:bg-gold-100 border border-gold-500/30 rounded-xl transition"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 text-maroon-800" />
          </Link>

          <Link
            to={`/book?service=${service.id}`}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-maroon-950 bg-gold-btn rounded-xl shadow-sm hover:shadow-gold-glow transition"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            <span>Book This</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
