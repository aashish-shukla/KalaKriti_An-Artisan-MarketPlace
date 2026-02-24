// artisan/src/components/ui/Dropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({ options, value, onChange, placeholder, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-[#f0ebe4] rounded-xl hover:border-[#c2703e]/30 focus:outline-none focus:ring-2 focus:ring-[#c2703e]/15 bg-white transition-all duration-200 text-sm"
      >
        <span className="flex items-center gap-2 text-[#2d3436]">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-[#6b5e54] transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f0ebe4] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 hover:bg-[#faf6f1] transition-colors text-left text-sm first:rounded-t-xl last:rounded-b-xl',
                option.value === value && 'bg-[#c2703e]/5 text-[#c2703e] font-medium'
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}