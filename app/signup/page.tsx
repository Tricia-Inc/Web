"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { NumericKeypad } from "@/components/numeric-keypad"

export default function OnBoarding2() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setPhoneNumber((prev) => prev.slice(0, -1))
    } else if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + key)
    }
  }

  const formatPhoneNumber = (value: string) => {
    if (!value) return ""
    const input = value.replace(/\D/g, "")
    const size = input.length
    if (size > 0) {
      if (size < 4) return `(${input}`
      if (size < 7) return `(${input.slice(0, 3)}) ${input.slice(3)}`
      return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`
    }
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.length === 10) {
      router.push("/signup/verify")
    }
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-[36px] font-medium tracking-[0.36px] text-[#2b2b2b] mb-8">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="mb-6">
            <label htmlFor="phone" className="block text-[17px] font-medium text-[#2b2b2b] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              className="w-full p-4 text-[16px] text-[#878787] border border-gray-300 rounded-lg"
              value={formatPhoneNumber(phoneNumber)}
              readOnly
              required
            />
          </div>

          <div className="flex-1"></div>

          <div className="mb-4">
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-[332px] h-[59px] flex items-center justify-center bg-[#2b2b2b] rounded-[15px] ${
                  phoneNumber.length === 10 ? "" : "opacity-70 cursor-not-allowed"
                }`}
                disabled={phoneNumber.length !== 10}
              >
                <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5]">Continue</span>
              </button>
            </div>
            <p className="text-[12px] text-center text-[#2b2b2b] w-[262px] h-[34px] mx-auto mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          <div className="rounded-t-3xl overflow-hidden mt-auto border-t border-gray-200">
            <NumericKeypad onKeyPress={handleKeyPress} />
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
