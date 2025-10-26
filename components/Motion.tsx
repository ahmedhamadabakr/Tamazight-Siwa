"use client"

import React from "react"

type AnyProps = Record<string, any>

function stripMotionProps<P extends AnyProps>(props: P): P {
  const {
    initial,
    animate,
    exit,
    whileInView,
    whileHover,
    whileTap,
    transition,
    viewport,
    variants,
    layout,
    layoutId,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    ...rest
  } = props as AnyProps
  return rest as P
}

function createMotionFallback<T extends keyof JSX.IntrinsicElements>(tag: T) {
  return function MotionFallback(props: AnyProps) {
    const [MotionTag, setMotionTag] = React.useState<React.ComponentType<AnyProps> | null>(null)

    React.useEffect(() => {
      let mounted = true
      ;(async () => {
        try {
          const { motion } = await import("framer-motion")
          if (mounted) {
            const comp = (motion as AnyProps)[tag]
            setMotionTag(() => comp)
          }
        } catch {
          // ignore
        }
      })()
      return () => { mounted = false }
    }, [])

    if (MotionTag) {
      return <MotionTag {...props} />
    }
    // Server and first client paint: render plain element without motion-only props
    const PlainTag = tag as any
    return <PlainTag {...stripMotionProps(props)} />
  }
}

export const MotionDiv = createMotionFallback("div")
export const MotionH1 = createMotionFallback("h1")
export const MotionP = createMotionFallback("p")
