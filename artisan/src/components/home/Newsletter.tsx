// artisan/src/components/home/Newsletter.tsx
'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubscribed(true);
    toast.success('Successfully subscribed to our newsletter!');
    setIsSubmitting(false);
    setEmail('');

    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#c2703e] via-[#d4915f] to-[#daa520] animate-gradient-shift" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-6 border border-white/10">
          <Mail className="w-8 h-8 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
          <Sparkles className="w-4 h-4 text-[#f0c75e]" />
          <span className="text-sm font-medium text-white/90">Stay Updated</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-serif)' }}>
          Never Miss a Masterpiece
        </h2>
        <p className="text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Subscribe to our newsletter for exclusive offers, artisan stories, and the latest handcrafted collections
        </p>

        {/* Form */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="bg-white text-[#c2703e] hover:bg-[#faf6f1] shadow-xl hover:shadow-2xl border-0"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/50 mt-4">
              Join 10,000+ subscribers. Unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <CheckCircle className="w-16 h-16 text-white" />
            <p className="text-xl font-semibold text-white">Welcome aboard! 🎉</p>
            <p className="text-white/75">Check your email for a special welcome gift</p>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white/60" />
            <span>No spam ever</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white/60" />
            <span>Weekly updates</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white/60" />
            <span>Exclusive deals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
