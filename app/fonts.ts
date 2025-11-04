import { Cairo } from 'next/font/google'

export const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  display: 'optional',
  variable: '--font-cairo',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})