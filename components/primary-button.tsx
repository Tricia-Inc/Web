import type React from "react"
import Link from "next/link"

interface PrimaryButtonProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function PrimaryButton({ children, href, className = "" }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={`w-full py-4 bg-black text-white text-center font-medium rounded-full text-lg ${className}`}
    >
      {children}
    </Link>
  )
}
