/**
 * Product Card Skeleton
 * Loading placeholder for product cards
 * 
 * @author Sparsh Srivastava
 */

export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-video bg-dark-700 rounded-lg mb-4 skeleton" />

      {/* Content skeleton */}
      <div className="space-y-3">
        <div>
          <div className="h-3 w-20 bg-dark-700 rounded skeleton mb-2" />
          <div className="h-5 w-full bg-dark-700 rounded skeleton mb-1" />
          <div className="h-5 w-3/4 bg-dark-700 rounded skeleton" />
        </div>

        {/* Specs skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-dark-700 rounded skeleton" />
          <div className="h-6 w-16 bg-dark-700 rounded skeleton" />
          <div className="h-6 w-24 bg-dark-700 rounded skeleton" />
        </div>

        {/* Price skeleton */}
        <div className="pt-3 border-t border-dark-700">
          <div className="h-8 w-32 bg-dark-700 rounded skeleton mb-3" />
          <div className="h-10 w-full bg-dark-700 rounded skeleton" />
        </div>
      </div>
    </div>
  )
}
