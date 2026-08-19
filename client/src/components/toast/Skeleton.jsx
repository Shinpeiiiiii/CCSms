import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// A wrapper component that configures theme based on dark/light context
export const SkeletonThemeWrapper = ({ children, isDark = false }) => {
  return (
    <SkeletonTheme
      baseColor={isDark ? '#1e293b' : '#e2e8f0'}
      highlightColor={isDark ? '#334155' : '#f1f5f9'}
    >
      {children}
    </SkeletonTheme>
  );
};

// Generic/Base Skeleton component wrapper
export const SkeletonComponent = ({ className = '', ...props }) => {
  return (
    <span className={className}>
      <Skeleton {...props} />
    </span>
  );
};

export default SkeletonComponent;

// 1. Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 5, isDark = false }) => {
  return (
    <SkeletonThemeWrapper isDark={isDark}>
      <div className="space-y-4 w-full">
        {/* Table Header Skeleton */}
        <div className="flex gap-4 pb-3 border-b border-gray-200/20">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={`head-${j}`} className="flex-1">
              <Skeleton height={20} width={`${60 + (j % 3) * 15}%`} borderRadius={6} />
            </div>
          ))}
        </div>
        {/* Table Rows Skeleton */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={`row-${i}`} className="flex gap-4 items-center py-2 border-b border-gray-100/5 last:border-0">
              {Array.from({ length: cols }).map((_, j) => (
                <div key={`cell-${i}-${j}`} className="flex-1">
                  <Skeleton 
                    height={36} 
                    width={j === cols - 1 ? '50%' : `${70 + ((i + j) % 4) * 8}%`} 
                    borderRadius={8} 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SkeletonThemeWrapper>
  );
};

// 2. Card Skeleton (Stat Cards or General Grid Cards)
export const CardSkeleton = ({ count = 4, gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', isDark = false }) => {
  return (
    <SkeletonThemeWrapper isDark={isDark}>
      <div className={gridClass}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border ${
              isDark 
                ? 'bg-slate-900/50 border-slate-800/80' 
                : 'bg-white border-gray-200/80 shadow-sm'
            } space-y-4`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                {/* Stat label */}
                <Skeleton height={14} width="60%" borderRadius={4} />
                {/* Stat value */}
                <Skeleton height={32} width="40%" borderRadius={6} />
              </div>
              {/* Stat Icon box */}
              <Skeleton circle height={40} width={40} className="ml-4" />
            </div>
            {/* Subtext info */}
            <Skeleton height={12} width="70%" borderRadius={4} />
          </div>
        ))}
      </div>
    </SkeletonThemeWrapper>
  );
};

// 3. Form Skeleton (Inputs + Buttons)
export const FormSkeleton = ({ fields = 4, isDark = false }) => {
  return (
    <SkeletonThemeWrapper isDark={isDark}>
      <div className="space-y-5 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton circle height={40} width={40} />
          <div className="flex-1 space-y-1.5">
            <Skeleton height={18} width="40%" borderRadius={4} />
            <Skeleton height={12} width="60%" borderRadius={3} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton height={14} width="30%" borderRadius={3} />
              <Skeleton height={42} borderRadius={10} />
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Skeleton height={40} width={90} borderRadius={10} />
          <Skeleton height={40} width={130} borderRadius={10} />
        </div>
      </div>
    </SkeletonThemeWrapper>
  );
};

// 4. Detail View Skeleton (Left avatar/info + right detail lists)
export const DetailSkeleton = ({ isDark = false }) => {
  return (
    <SkeletonThemeWrapper isDark={isDark}>
      <div className="space-y-6 w-full">
        <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-gray-200/10">
          <Skeleton circle height={96} width={96} className="mx-auto md:mx-0" />
          <div className="flex-1 space-y-3 w-full text-center md:text-left">
            <Skeleton height={28} width="50%" className="mx-auto md:mx-0" borderRadius={6} />
            <Skeleton height={16} width="35%" className="mx-auto md:mx-0" borderRadius={4} />
            <div className="flex gap-2 justify-center md:justify-start">
              <Skeleton height={22} width={80} borderRadius={100} />
              <Skeleton height={22} width={80} borderRadius={100} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100/5">
              <Skeleton height={14} width="40%" borderRadius={4} />
              <Skeleton height={14} width="50%" borderRadius={4} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonThemeWrapper>
  );
};