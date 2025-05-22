"use client"

import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function OnBoarding1() {
  const router = useRouter()

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Spacer to push content down a bit */}
        <div className="h-[100px]"></div>

        {/* Main content area */}
        <div>
          <h1 className="text-[36px] font-medium leading-tight tracking-[0.36px] text-[#2b2b2b] w-[332px] h-[164px] text-left">
            Journal Your
            <br />
            Memories Share Your Stories
          </h1>
          <p className="text-[16px] font-medium text-[#2b2b2b] w-[311px] h-[91px] text-left">
            Discover a smarter way to preserve memories, stay connected, and discover every step of the journey
            meaningful and effortless
          </p>
        </div>

        {/* Spacer to push buttons down */}
        <div className="flex-1"></div>

        {/* Buttons section */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center"
            >
              <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[114px] h-[28px]">
                Sign Up
              </span>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => router.push("/login")}
              className="w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center"
            >
              <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[114px] h-[28px]">
                Login
              </span>
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
