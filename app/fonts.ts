import { Cairo } from 'next/font/google'

export const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-cairo',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

// Font optimization utility
export const fontOptimization = {
  preloadFonts: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap',
      as: 'style',
      onload: "this.onload=null;this.rel='stylesheet'",
    },
  ],
}