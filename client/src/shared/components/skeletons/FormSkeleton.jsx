import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CustomSkeletonTheme from './CustomSkeletonTheme'

export const FormSkeleton = ({ fields = 6, cols = 2 }) => {
  return (
    <CustomSkeletonTheme>
      <div style={{
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 18,
        padding: 28,
        marginBottom: 24
      }}>
        <Skeleton width={140} height={20} style={{ marginBottom: 24 }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 1 ? '100%' : '240px'}, 1fr))`,
          gap: 16,
          marginBottom: 24
        }}>
          {Array.from({ length: fields }).map((_, idx) => (
            <div key={idx}>
              <Skeleton width={90} height={12} style={{ marginBottom: 8 }} />
              <Skeleton height={42} borderRadius={10} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Skeleton width={100} height={40} borderRadius={10} />
          <Skeleton width={130} height={40} borderRadius={10} />
        </div>
      </div>
    </CustomSkeletonTheme>
  )
}

export default FormSkeleton
