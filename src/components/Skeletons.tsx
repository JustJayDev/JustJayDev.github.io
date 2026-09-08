import React from 'react';

/**
 * Skeletons — shimmering placeholders shown while lazy pages load.
 * Matches each page's real layout so there's no jarring blank flash.
 */
const Shimmer: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const HomeSkeleton: React.FC = () => (
  <div className="page-container pt-10 pb-16 space-y-8">
    <div className="space-y-3">
      <Shimmer className="h-3 w-40 rounded-full" />
      <Shimmer className="h-12 w-72 rounded-2xl" />
      <Shimmer className="h-4 w-full max-w-md rounded-full" />
      <Shimmer className="h-4 w-56 rounded-full" />
    </div>
    <div className="flex gap-3">
      <Shimmer className="h-11 w-36 rounded-2xl" />
      <Shimmer className="h-11 w-36 rounded-2xl" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <Shimmer key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
    <Shimmer className="h-44 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Shimmer className="h-52 rounded-3xl" />
      <Shimmer className="h-52 rounded-3xl" />
    </div>
  </div>
);

export const GamesSkeleton: React.FC = () => (
  <div className="page-container pt-10 pb-16 space-y-6">
    <div className="space-y-3">
      <Shimmer className="h-10 w-52 rounded-2xl" />
      <Shimmer className="h-4 w-full max-w-sm rounded-full" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-3xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          <Shimmer className="h-28 w-full" />
          <div className="p-4 space-y-2.5">
            <Shimmer className="h-4 w-32 rounded-full" />
            <Shimmer className="h-3 w-full rounded-full" />
            <Shimmer className="h-3 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DevlogSkeleton: React.FC = () => (
  <div className="page-container pt-10 pb-16 space-y-5">
    <Shimmer className="h-10 w-44 rounded-2xl" />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="rounded-3xl p-5 space-y-3" style={{ border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <Shimmer className="h-8 w-8 rounded-xl" />
          <Shimmer className="h-4 w-40 rounded-full" />
        </div>
        <Shimmer className="h-3 w-full rounded-full" />
        <Shimmer className="h-3 w-4/5 rounded-full" />
      </div>
    ))}
  </div>
);

export const AboutSkeleton: React.FC = () => (
  <div className="page-container pt-10 pb-16 space-y-6">
    <div className="flex items-center gap-4">
      <Shimmer className="h-20 w-20 rounded-3xl" />
      <div className="space-y-2.5">
        <Shimmer className="h-6 w-40 rounded-xl" />
        <Shimmer className="h-3 w-28 rounded-full" />
      </div>
    </div>
    <Shimmer className="h-32 rounded-3xl" />
    <div className="grid grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <Shimmer key={i} className="h-20 rounded-2xl" />
      ))}
    </div>
    <Shimmer className="h-40 rounded-3xl" />
  </div>
);