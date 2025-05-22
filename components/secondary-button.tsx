import type React from "react"
import Link from "next/link"

interface SecondaryButtonProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function SecondaryButton({ children, href, className = "" }: SecondaryButtonProps) {
  return (
    <Link href={href} className={`text-black underline text-center font-medium ${className}`}>
      {children}
    </Link>
  )
}
