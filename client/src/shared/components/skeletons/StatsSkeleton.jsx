import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CustomSkeletonTheme from './CustomSkeletonTheme'

export const StatsSkeleton = ({ count = 4 }) => {
  return (
    <CustomSkeletonTheme>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 16,
              padding: 20
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Skeleton width={90} height={12} />
              <Skeleton circle width={36} height={36} />
            </div>
            <Skeleton width={70} height={32} style={{ marginBottom: 8 }} />
            <Skeleton width={110} height={10} />
          </div>
        ))}
      </div>
    </CustomSkeletonTheme>
  )
}

export default StatsSkeleton
