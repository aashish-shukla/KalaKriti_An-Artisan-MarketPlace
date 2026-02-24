// artisan/src/components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[#2d3436] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full border rounded-xl px-4 py-2.5 text-sm transition-all duration-200 bg-white',
            'placeholder:text-[#6b5e54]/50',
            'focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 focus:border-[#c2703e]',
            error
              ? 'border-[#c0392b]/40 focus:border-[#c0392b] focus:ring-[#c0392b]/10'
              : 'border-[#f0ebe4] hover:border-[#c2703e]/30',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[#c0392b] font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-[#6b5e54]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';