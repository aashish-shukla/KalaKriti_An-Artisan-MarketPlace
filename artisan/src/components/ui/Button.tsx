// artisan/src/components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-[#c2703e] via-[#d4915f] to-[#daa520] text-white hover:from-[#a85a30] hover:via-[#c2703e] hover:to-[#c2953a] active:from-[#8d4c28] active:to-[#a88520] shadow-md hover:shadow-lg hover:shadow-[#c2703e]/20',
      secondary:
        'bg-[#2d3436] text-white hover:bg-[#1a1a2e] shadow-md hover:shadow-lg',
      outline:
        'border-2 border-[#c2703e]/30 text-[#c2703e] hover:border-[#c2703e] hover:bg-[#c2703e]/5 hover:text-[#a85a30]',
      ghost:
        'text-[#6b5e54] hover:bg-[#f0ebe4] hover:text-[#c2703e]',
      danger:
        'bg-gradient-to-r from-[#c0392b] to-[#e74c3c] text-white hover:from-[#a93226] hover:to-[#c0392b] shadow-md hover:shadow-lg',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] tracking-wide',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';