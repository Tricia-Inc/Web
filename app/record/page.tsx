"use client"

import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function RecordPage() {
  const router = useRouter()

  return (
    <MobileLayout>
      <div className="flex flex-col h-full bg-[#F5F5F5]">
        {/* Status Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[17px] font-semibold">9:41</div>
          <div className="flex items-center gap-1">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 6C1 4.93913 1.42143 3.92172 2.17157 3.17157C2.92172 2.42143 3.93913 2 5 2H13C14.0609 2 15.0783 2.42143 15.8284 3.17157C16.5786 3.92172 17 4.93913 17 6V10C17 11.0609 16.5786 12.0783 15.8284 12.8284C15.0783 13.5786 14.0609 14 13 14H5C3.93913 14 2.92172 13.5786 2.17157 12.8284C1.42143 12.0783 1 11.0609 1 10V6Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6 14V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLin />
              <path d="M12 14V16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 10V10.01" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 6C19.5523 6 20 6.44772 20 7V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9V7C18 6.44772 18.4477 6 19 6Z"
                fill="black"
              />
              <path
                d="M15 3C15.5523 3 16 3.44772 16 4V12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12V4C14 3.44772 14.4477 3 15 3Z"
                fill="black"
              />
              <path
                d="M11 0C11.5523 0 12 0.447715 12 1V15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V1C10 0.447715 10.4477 0 11 0Z"
                fill="black"
              />
              <path
                d="M7 4C7.55228 4 8 4.44772 8 5V11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11V5C6 4.44772 6.44772 4 7 4Z"
                fill="black"
              />
              <path
                d="M3 6C3.55228 6 4 6.44772 4 7V9C4 9.55228 3.55228 10 3 10C2.44772 10 2 9.55228 2 9V7C2 6.44772 2.44772 6 3 6Z"
                fill="black"
              />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="black" />
              <path d="M23 4V8C24.1046 7.66122 25 6.17335 25 5C25 3.82665 24.1046 2.33878 23 2V4Z" fill="black" />
            </svg>
          </div>
        </div>

        {/* Top Navigation */}
        <div className="flex justify-between items-center px-4">
          {/* Sparkle Icon */}
          <button className="w-10 h-10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 3L19.5 12.5H29L21.5 18.5L24.5 28L16 22L7.5 28L10.5 18.5L3 12.5H12.5L16 3Z"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M24 4L26 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 4L6 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Profile Icon */}
          <button onClick={() => router.push("/profile")} className="w-10 h-10 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" stroke="black" strokeWidth="2" />
              <circle cx="18" cy="14" r="6" stroke="black" strokeWidth="2" />
              <path d="M30 30C30 24.4772 24.6274 20 18 20C11.3726 20 6 24.4772 6 30" stroke="black" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Main Content - Green Circle */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[240px] h-[240px]">
            {/* Outer light green circle */}
            <div className="absolute inset-0 rounded-full bg-[#A9FAC5] opacity-50"></div>

            {/* Middle green circle */}
            <div className="absolute inset-[20px] rounded-full bg-[#7AF8A8] opacity-70"></div>

            {/* Inner dark green circle */}
            <div className="absolute inset-[50px] rounded-full bg-[#1B9A37] opacity-80"></div>

            {/* Center green circle */}
            <div className="absolute inset-[80px] rounded-full bg-[#38B240] opacity-90"></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center px-12 py-6">
          {/* Camera Icon */}
          <button className="w-12 h-12 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M38 38H10C8.93913 38 7.92172 37.5786 7.17157 36.8284C6.42143 36.0783 6 35.0609 6 34V16C6 14.9391 6.42143 13.9217 7.17157 13.1716C7.92172 12.4214 8.93913 12 10 12H16L20 6H28L32 12H38C39.0609 12 40.0783 12.4214 40.8284 13.1716C41.5786 13.9217 42 14.9391 42 16V34C42 35.0609 41.5786 36.0783 40.8284 36.8284C40.0783 37.5786 39.0609 38 38 38Z"
                stroke="#606060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 31C27.3137 31 30 28.3137 30 25C30 21.6863 27.3137 19 24 19C20.6863 19 18 21.6863 18 25C18 28.3137 20.6863 31 24 31Z"
                stroke="#606060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Microphone Button */}
          <button className="w-20 h-20 bg-[#2b2b2b] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 1C15.2044 1 14.4413 1.31607 13.8787 1.87868C13.3161 2.44129 13 3.20435 13 4V16C13 16.7956 13.3161 17.5587 13.8787 18.1213C14.4413 18.6839 15.2044 19 16 19C16.7956 19 17.5587 18.6839 18.1213 18.1213C18.6839 17.5587 19 16.7956 19 16V4C19 3.20435 18.6839 2.44129 18.1213 1.87868C17.5587 1.31607 16.7956 1 16 1Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25 14V16C25 18.3869 24.0518 20.6761 22.364 22.364C20.6761 24.0518 18.3869 25 16 25C13.6131 25 11.3239 24.0518 9.63604 22.364C7.94821 20.6761 7 18.3869 7 16V14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M16 25V31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 31H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Note Icon */}
          <button className="w-12 h-12 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 6H10C8.93913 6 7.92172 6.42143 7.17157 7.17157C6.42143 7.92172 6 8.93913 6 10V38C6 39.0609 6.42143 40.0783 7.17157 40.8284C7.92172 41.5786 8.93913 42 10 42H38C39.0609 42 40.0783 41.5786 40.8284 40.8284C41.5786 40.0783 42 39.0609 42 38V18L30 6Z"
                stroke="#606060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M30 6V18H42" stroke="#606060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 27H14" stroke="#606060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 35H14" stroke="#606060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 19H14" stroke="#606060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 35L36 41" stroke="#606060" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </MobileLayout>
  )
}
