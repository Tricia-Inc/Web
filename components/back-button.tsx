"use client"

import { useRouter } from "next/navigation"

interface BackButtonProps {
  onClick?: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  return (
    <button onClick={handleClick} className="w-[60px] h-[49px] flex items-center justify-center" aria-label="Back">
      {/* Back button icon with specified dimensions */}
      <div className="w-[60px] h-[49px] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#2b2b2b]"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
    </button>
  )
}
