import React from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const CustomSkeletonTheme = ({
  children,
  baseColor = 'rgba(255, 255, 255, 0.06)',
  highlightColor = 'rgba(255, 255, 255, 0.12)',
  borderRadius = 10
}) => {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} borderRadius={borderRadius}>
      {children}
    </SkeletonTheme>
  )
}

export default CustomSkeletonTheme
