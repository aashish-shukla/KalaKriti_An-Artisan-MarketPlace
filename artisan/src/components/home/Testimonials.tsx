// artisan/src/components/home/Testimonials.tsx
'use client';

import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Art Collector',
    rating: 5,
    text: 'The quality of handcrafted items here is exceptional. Every piece tells a story and brings character to my home. I love supporting local artisans!',
    avatar: 'SJ',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Interior Designer',
    rating: 5,
    text: 'As a designer, I always recommend this marketplace to my clients. The unique pieces add authenticity and charm that mass-produced items simply can\'t match.',
    avatar: 'MC',
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Handmade Jewelry Seller',
    rating: 5,
    text: 'Setting up my shop was incredibly easy, and the platform has helped me reach customers I never would have found otherwise. The community here is amazing!',
    avatar: 'EW',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Pottery Enthusiast',
    rating: 5,
    text: 'I\'ve found so many unique ceramic pieces here. The ability to connect directly with artisans and learn about their process makes every purchase special.',
    avatar: 'DR',
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#faf6f1] via-white to-[#f0ebe4]">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-[#c2703e]/5 to-[#daa520]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-[#daa520]/5 to-[#c2703e]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#daa520]/10 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-[#daa520] fill-[#daa520]" />
            <span className="text-sm font-semibold text-[#daa520] uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-4xl font-bold text-[#2d3436] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Loved by Artisans & Buyers
          </h2>
          <p className="text-xl text-[#6b5e54] max-w-2xl mx-auto">
            Thousands of people trust our marketplace for unique, handcrafted treasures
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-6 shadow-md transform transition-all duration-500 hover:scale-[1.03] hover:shadow-xl border ${activeIndex === index ? 'border-[#c2703e]/40 shadow-[#c2703e]/5' : 'border-[#f0ebe4]'
                }`}
              style={{
                animation: 'fadeInUp 0.6s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[#c2703e]/20" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#daa520] fill-[#daa520]" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#6b5e54] text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#f0ebe4]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c2703e] to-[#daa520] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#2d3436] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#6b5e54]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-[#c2703e] w-8' : 'bg-[#f0ebe4] w-2'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
