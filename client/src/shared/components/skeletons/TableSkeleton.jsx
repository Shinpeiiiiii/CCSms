import React from 'react'
import Skeleton from 'react-loading-skeleton'
import CustomSkeletonTheme from './CustomSkeletonTheme'

export const TableSkeleton = ({
  rows = 5,
  cols = 6,
  showHeader = true,
  hasCheckbox = true
}) => {
  return (
    <CustomSkeletonTheme>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 18,
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {showHeader && (
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.01)' }}>
                  {hasCheckbox && (
                    <th style={{ padding: '14px 16px', width: 40, textAlign: 'center' }}>
                      <Skeleton width={16} height={16} />
                    </th>
                  )}
                  {Array.from({ length: cols }).map((_, idx) => (
                    <th key={idx} style={{ padding: '14px 20px', textAlign: 'left' }}>
                      <Skeleton width={80 + (idx % 3) * 20} height={14} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {Array.from({ length: rows }).map((_, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: rIdx < rows - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  {hasCheckbox && (
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <Skeleton width={16} height={16} />
                    </td>
                  )}
                  {/* First col: Avatar + Text */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Skeleton circle width={32} height={32} />
                      <div style={{ flex: 1 }}>
                        <Skeleton width={120} height={14} style={{ marginBottom: 4 }} />
                        <Skeleton width={70} height={10} />
                      </div>
                    </div>
                  </td>
                  {/* Remaining cols */}
                  {Array.from({ length: cols - 1 }).map((_, cIdx) => (
                    <td key={cIdx} style={{ padding: '14px 20px' }}>
                      {cIdx === 1 ? (
                        /* Badge column */
                        <Skeleton width={90} height={22} borderRadius={100} />
                      ) : cIdx === cols - 2 ? (
                        /* Status/Short column */
                        <Skeleton width={60} height={14} />
                      ) : (
                        /* Regular text / action column */
                        <Skeleton width={110 - (cIdx * 15)} height={14} />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CustomSkeletonTheme>
  )
}

export default TableSkeleton
