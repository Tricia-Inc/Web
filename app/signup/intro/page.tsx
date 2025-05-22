"use client"

import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function OnBoarding4() {
  const router = useRouter()

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-[36px] font-medium tracking-[0.36px] text-[#2b2b2b]">
            Hi there,
            <br />
            I'm Tricia
          </h1>
          <p className="text-[16px] font-medium text-[#2b2b2b] w-[344px] h-[75px] text-left mt-4">
            Your new personal Journaling companion
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <button
            onClick={() => router.push("/signup/name")}
            className="w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center"
          >
            <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[114px] h-[28px]">
              Hi, Tricia!
            </span>
          </button>
        </div>
      </div>
    </MobileLayout>
  )
}
