'use client'

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
  session?: any
}) {
  return <>{children}</>
}
