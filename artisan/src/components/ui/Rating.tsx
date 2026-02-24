// artisan/src/components/ui/Rating.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function Rating({ value, max = 5, size = 'md', showValue, onChange, readonly = true }: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleClick(rating)}
          disabled={readonly}
          className={cn(!readonly && 'cursor-pointer hover:scale-110 transition-transform')}
        >
          <Star
            className={cn(
              sizes[size],
              rating <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        </button>
      ))}
      {showValue && <span className="text-sm font-medium text-gray-700 ml-1">{value.toFixed(1)}</span>}
    </div>
  );
}