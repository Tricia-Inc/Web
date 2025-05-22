import type React from "react"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative w-[430px] h-[932px] overflow-hidden shadow-xl"
        style={{
          backgroundColor: "rgb(245, 245, 245)",
          borderRadius: "40px",
        }}
      >
        <div className="h-full flex flex-col p-8 overflow-hidden relative">{children}</div>
      </div>
    </div>
  )
}
