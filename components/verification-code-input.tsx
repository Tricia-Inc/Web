"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface VerificationCodeInputProps {
  length: number
  onChange: (code: string) => void
}

export function VerificationCodeInput({ length, onChange }: VerificationCodeInputProps) {
  const [code, setCode] = useState(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    // Take only the last character if multiple are pasted
    newCode[index] = value.slice(-1)
    setCode(newCode)

    // Call the onChange callback with the complete code
    onChange(newCode.join(""))

    // Move to the next input if a digit was entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to the previous input on backspace if current input is empty  => {
    // Move to the previous input on backspace if current input is empty
    if (e.key === "Backspace" && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    if (!/^\d*$/.test(pastedData)) return

    const newCode = [...code]
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)
    onChange(newCode.join(""))

    // Focus the input after the last pasted digit
    const focusIndex = Math.min(length - 1, pastedData.length - 1)
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus()
    }
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-full h-14 text-center text-xl font-medium border border-gray-300 rounded-lg"
        />
      ))}
    </div>
  )
}
