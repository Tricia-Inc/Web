"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { DateOfBirthInput } from "@/components/date-of-birth-input"

export default function OnBoarding6() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [dob, setDob] = useState({ day: "", month: "", year: "" })
  // Make the button active by default
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    // In a real app, you'd get this from a context or state management
    const storedName = localStorage.getItem("userName")
    if (storedName) {
      setName(storedName)
    }
  }, [])

  useEffect(() => {
    // Only do basic validation if all fields have some value
    if (dob.day && dob.month && dob.year) {
      const dayNum = Number.parseInt(dob.day)
      const monthNum = Number.parseInt(dob.month)
      const yearNum = Number.parseInt(dob.year)

      // Very basic validation to prevent completely invalid dates
      const isBasicallyValid =
        dayNum > 0 &&
        dayNum <= 31 &&
        monthNum > 0 &&
        monthNum <= 12 &&
        yearNum >= 1900 &&
        yearNum <= new Date().getFullYear()

      setIsValid(isBasicallyValid)
    } else {
      // Keep button active even if fields are empty
      setIsValid(true)
    }
  }, [dob])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save whatever date is entered, even if incomplete
    if (dob.day || dob.month || dob.year) {
      localStorage.setItem("userDob", `${dob.month || "01"}/${dob.day || "01"}/${dob.year || new Date().getFullYear()}`)
    }

    // Navigate to chatpage instead of main
    router.push("/chatpage")
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-[36px] font-medium tracking-[0.36px] text-[#2b2b2b] w-[374px] h-[164px] text-left">
              Hi {name || "there"},
              <br />
              What's your
              <br />
              Date of Birth?
            </h1>

            <DateOfBirthInput onChange={setDob} />

            {/* Add a hint for users */}
            <p className="text-sm text-gray-500 mt-2">Please enter your date of birth in MM/DD/YYYY format.</p>
          </div>

          <div className="mb-8 flex justify-center">
            <button
              type="submit"
              className="w-[332px] h-[59px] bg-[#2b2b2b] rounded-[15px] flex items-center justify-center"
            >
              <span className="text-[20px] font-medium tracking-[0.2px] text-center text-[#f5f5f5] w-[137px] h-[28px]">
                Let's Journal!
              </span>
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  )
}
