"use client"

import dynamic from "next/dynamic"
import type React from "react"
import type { MotionProps } from "framer-motion"

type DivProps = React.HTMLAttributes<HTMLDivElement> & MotionProps
type H1Props = React.HTMLAttributes<HTMLHeadingElement> & MotionProps
type PProps = React.HTMLAttributes<HTMLParagraphElement> & MotionProps

export const MotionDiv = dynamic(async () => {
  const { motion } = await import("framer-motion")
  return function MotionDivInner(props: DivProps) {
    return <motion.div {...props} />
  }
}, { ssr: false }) as unknown as (props: DivProps) => JSX.Element

export const MotionH1 = dynamic(async () => {
  const { motion } = await import("framer-motion")
  return function MotionH1Inner(props: H1Props) {
    return <motion.h1 {...props} />
  }
}, { ssr: false }) as unknown as (props: H1Props) => JSX.Element

export const MotionP = dynamic(async () => {
  const { motion } = await import("framer-motion")
  return function MotionPInner(props: PProps) {
    return <motion.p {...props} />
  }
}, { ssr: false }) as unknown as (props: PProps) => JSX.Element
