import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CustomSkeletonTheme from './CustomSkeletonTheme'

export const CardSkeleton = ({
  count = 1,
  gridCols = 'repeat(auto-fit, minmax(280px, 1fr))',
  hasFooter = true
}) => {
  return (
    <CustomSkeletonTheme>
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 16 }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 18,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <Skeleton width={130} height={16} />
                <Skeleton width={60} height={22} borderRadius={100} />
              </div>

              <Skeleton width="90%" height={24} style={{ marginBottom: 8 }} />
              <Skeleton count={2} height={12} style={{ marginBottom: 6 }} />
            </div>

            {hasFooter && (
              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width={80} height={12} />
                <Skeleton width={100} height={32} borderRadius={10} />
              </div>
            )}
          </div>
        ))}
      </div>
    </CustomSkeletonTheme>
  )
}

export default CardSkeleton
