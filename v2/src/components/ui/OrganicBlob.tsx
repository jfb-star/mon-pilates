"use client"

export function OrganicBlob({
  className,
  color = "mp-ocean",
  size = 400,
}: {
  className?: string
  color?: string
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`absolute pointer-events-none motion-reduce:hidden ${className ?? ""}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        className="animate-blob-morph"
        fill={`var(--${color})`}
        opacity="0.05"
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,73.1,41.3C64.8,53.6,53.8,63.7,41,71.2C28.2,78.7,13.6,83.6,-1.4,86C-16.4,88.4,-32.8,88.3,-46.1,81.6C-59.4,74.9,-69.6,61.6,-76.8,47C-84,32.4,-88.2,16.2,-87.9,0.2C-87.6,-15.8,-82.8,-31.6,-74.4,-44.4C-66,-57.2,-54,-67,-40.6,-74.5C-27.2,-82,-13.6,-87.2,1.1,-89C15.8,-90.8,30.6,-89.2,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  )
}
