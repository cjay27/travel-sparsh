import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizes[size]} rounded-full border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400 animate-spin`}
      />
      {text && (
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Page-level loading
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

// Skeleton card loader
export const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="skeleton h-4 w-3/4 mb-4 rounded" />
    <div className="skeleton h-3 w-1/2 mb-3 rounded" />
    <div className="skeleton h-3 w-2/3 mb-3 rounded" />
    <div className="skeleton h-8 w-1/3 mt-4 rounded-lg" />
  </div>
);

export default LoadingSpinner;
