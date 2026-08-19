import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CustomSkeletonTheme from './CustomSkeletonTheme'

export const DetailSkeleton = () => {
  return (
    <CustomSkeletonTheme>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Banner Skeleton */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Skeleton width={100} height={12} style={{ marginBottom: 6 }} />
            <Skeleton width={200} height={28} />
          </div>
          <Skeleton width={130} height={32} borderRadius={100} />
        </div>

        {/* Timeline / Card Skeleton */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          padding: 24
        }}>
          <Skeleton width={160} height={18} style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Skeleton circle width={24} height={24} />
                <div style={{ flex: 1 }}>
                  <Skeleton width={180} height={14} style={{ marginBottom: 4 }} />
                  <Skeleton width={240} height={10} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key-Value Details Skeleton Grid */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          padding: 24
        }}>
          <Skeleton width={140} height={18} style={{ marginBottom: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.015)', padding: 14, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <Skeleton width={80} height={10} style={{ marginBottom: 6 }} />
                <Skeleton width={130} height={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CustomSkeletonTheme>
  )
}

export default DetailSkeleton
