// artisan/src/components/ui/LoadingSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Shop name */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        
        {/* Product name */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-200 rounded" />
          ))}
        </div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-200" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
    </div>
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-100 relative">
        {/* Logo skeleton */}
        <div className="absolute -bottom-8 left-6">
          <div className="w-16 h-16 rounded-xl bg-white border-4 border-white" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="pt-12 px-6 pb-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl animate-bounce" style={{ background: 'var(--gradient-primary)' }}>
          <span className="text-white font-bold text-2xl">A</span>
        </div>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-gray-600 mt-4 font-medium">Loading...</p>
      </div>
    </div>
  );
}
