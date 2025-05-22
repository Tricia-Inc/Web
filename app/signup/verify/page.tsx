"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { VerificationCodeInput } from "@/components/verification-code-input"

export default function OnBoarding3() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length === 6) {
      router.push("/signup/intro")
    }
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-[36px] font-medium tracking-[0.36px] text-[#2b2b2b] mb-8">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="mb-6">
            <label htmlFor="code" className="block text-[17px] font-medium text-[#2b2b2b] mb-2">
              Enter 6-digit verification code
            </label>
            <p className="text-[16px] text-[#878787] mb-4">We sent a code to your phone number</p>

            <VerificationCodeInput length={6} onChange={setVerificationCode} />
          </div>

          <button
            type="button"
            className="text-[#2b2b2b] font-medium mb-8 underline"
            onClick={() => alert("Code resent!")}
          >
            Resend code
          </button>

          <div className="flex-1"></div>

          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className={`w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center ${
                verificationCode.length === 6 ? "" : "opacity-70 cursor-not-allowed"
              }`}
              disabled={verificationCode.length !== 6}
            >
              <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[114px] h-[28px]">
                Verify
              </span>
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
