"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface DateOfBirthInputProps {
  onChange: (date: { day: string; month: string; year: string }) => void
}

export function DateOfBirthInput({ onChange }: DateOfBirthInputProps) {
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => {
    onChange({ day, month, year })
  }, [day, month, year, onChange])

  // Update the handleDayChange function to better handle user input
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value === "") {
      setDay("")
    } else {
      const numValue = Number.parseInt(value)
      if (numValue <= 31 && numValue > 0) {
        setDay(value.slice(0, 2))
      } else if (value.length <= 2) {
        // Allow typing but don't validate until complete
        setDay(value)
      }
    }
  }

  // Update the handleMonthChange function to better handle user input
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value === "") {
      setMonth("")
    } else {
      const numValue = Number.parseInt(value)
      if (numValue <= 12 && numValue > 0) {
        setMonth(value.slice(0, 2))
      } else if (value.length <= 2) {
        // Allow typing but don't validate until complete
        setMonth(value)
      }
    }
  }

  // Update the handleYearChange function to better handle user input
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const currentYear = new Date().getFullYear()
    if (value === "") {
      setYear("")
    } else if (value.length <= 4) {
      setYear(value)
      // Only validate if we have all 4 digits
      if (value.length === 4) {
        const numValue = Number.parseInt(value)
        if (numValue > currentYear || numValue < 1900) {
          // If invalid, keep the input but don't consider it valid
          // This allows the user to correct it
        }
      }
    }
  }

  // Add keyboard navigation between fields for better user experience
  const handleDayKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (day.length === 2 && e.key !== "Backspace") {
      // Auto-advance to year field when day is complete
      document.getElementById("year")?.focus()
    }
  }

  const handleMonthKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (month.length === 2 && e.key !== "Backspace") {
      // Auto-advance to day field when month is complete
      document.getElementById("day")?.focus()
    }
  }

  // Update the return JSX to include the new key handlers
  return (
    <div className="flex gap-4 mt-4">
      <div className="w-1/3">
        <label htmlFor="month" className="block text-sm font-medium mb-1 text-[#2b2b2b]">
          Month
        </label>
        <input
          type="text"
          id="month"
          placeholder="MM"
          maxLength={2}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg text-center"
          value={month}
          onChange={handleMonthChange}
          onKeyUp={handleMonthKeyUp}
        />
      </div>
      <div className="w-1/3">
        <label htmlFor="day" className="block text-sm font-medium mb-1 text-[#2b2b2b]">
          Day
        </label>
        <input
          type="text"
          id="day"
          placeholder="DD"
          maxLength={2}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg text-center"
          value={day}
          onChange={handleDayChange}
          onKeyUp={handleDayKeyUp}
        />
      </div>
      <div className="w-1/3">
        <label htmlFor="year" className="block text-sm font-medium mb-1 text-[#2b2b2b]">
          Year
        </label>
        <input
          type="text"
          id="year"
          placeholder="YYYY"
          maxLength={4}
          className="w-full p-4 text-lg border border-gray-300 rounded-lg text-center"
          value={year}
          onChange={handleYearChange}
        />
      </div>
    </div>
  )
}
