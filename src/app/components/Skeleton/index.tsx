import type { CSSProperties } from 'react'
import styles from './index.module.css'

type SkeletonProps = {
  /** CSS width — number is treated as `px`. */
  width?: number | string
  /** CSS height — number is treated as `px`. */
  height?: number | string
  /** Corner radius — number is treated as `px`. Defaults to `8px`. */
  radius?: number | string
  /** Disable the shimmer animation. Used for hidden / off-screen placeholders. */
  noAnimation?: boolean
  className?: string
  style?: CSSProperties
}

/** Reusable shimmering placeholder used while data is being fetched. */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  noAnimation,
  className,
  style,
}: SkeletonProps) {
  const mergedStyle: CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
    ...style,
  }
  return (
    <span
      aria-hidden="true"
      className={`${styles.block} ${noAnimation ? '' : styles.animated} ${className ?? ''}`}
      style={mergedStyle}
    />
  )
}
