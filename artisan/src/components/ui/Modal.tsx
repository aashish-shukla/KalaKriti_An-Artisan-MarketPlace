// artisan/src/components/ui/Modal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full animate-scale-in border border-[#f0ebe4]',
          sizes[size]
        )}
        style={{ animationDuration: '0.25s' }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ebe4]">
            <h3 className="text-lg font-semibold text-[#2d3436]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#f0ebe4] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6b5e54]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}