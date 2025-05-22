"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function OnBoarding5() {
  const router = useRouter()
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      // In a real app, you'd save this to your backend
      localStorage.setItem("userName", name.trim())
      router.push("/signup/dob")
    }
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-[36px] font-medium tracking-[0.36px] text-[#2b2b2b] mb-8">
              So nice to meet you!
              <br />
              What's your name?
            </h1>

            <input
              type="text"
              placeholder="Your name"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-8 flex justify-center">
            <button
              type="submit"
              className={`w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center ${
                name.trim() ? "" : "opacity-70 cursor-not-allowed"
              }`}
              disabled={!name.trim()}
            >
              <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[114px] h-[28px]">
                Continue
              </span>
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
