export default function SkeletonLoader({ count = 3 }) {
  return (
    <div className="space-y-4">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
          {/* Header skeleton */}
          <div className="flex justify-between items-start mb-3">
            <div className="skeleton-shimmer h-6 w-40 rounded"></div>
            <div className="skeleton-shimmer h-6 w-20 rounded"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-3">
            <div className="skeleton-shimmer h-4 w-full rounded"></div>
            <div className="skeleton-shimmer h-4 w-5/6 rounded"></div>
          </div>

          {/* Footer skeleton */}
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-8 w-24 rounded"></div>
            <div className="skeleton-shimmer h-8 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
