"use client"

import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function SettingsPage() {
  const router = useRouter()

  const handleSignOut = () => {
    // In a real app, you would clear authentication state here
    router.push("/")
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
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

        {/* Header with back button */}
        <div className="flex justify-between items-center mb-6">
          {/* Back button - Updated to match profile page */}
          <button onClick={() => router.back()} className="w-[35px] h-[35px] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#4F4F4F]"
            >
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Empty div to maintain the justify-between layout */}
          <div className="w-[35px]"></div>
        </div>

        {/* Account Section */}
        <h2 className="text-[32px] font-bold mb-4">Account</h2>
        <div className="bg-[#D9D9D9] rounded-lg p-4 mb-6">
          <p className="text-[20px] text-[#4F4F4F]">Alen</p>
        </div>

        {/* General Settings Section */}
        <h2 className="text-[32px] font-bold mb-4">General Settings</h2>
        <div className="bg-[#D9D9D9] rounded-lg p-4 mb-6">
          <p className="text-[20px] text-[#4F4F4F]">Notification</p>
        </div>

        {/* About Section */}
        <h2 className="text-[32px] font-bold mb-4">About</h2>
        <div className="bg-[#D9D9D9] rounded-lg p-4 mb-3">
          <p className="text-[20px] text-[#4F4F4F]">Privacy Policy</p>
        </div>
        <div className="bg-[#D9D9D9] rounded-lg p-4 mb-6">
          <p className="text-[20px] text-[#4F4F4F]">Terms of Use</p>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Sign Out Button */}
        <button onClick={handleSignOut} className="bg-[#D9D9D9] rounded-lg p-4 mb-10 text-center">
          <p className="text-[20px] font-bold text-[#FA5C5C] w-[140px] h-[26px] text-left">Sign Out</p>
        </button>
      </div>
    </MobileLayout>
  )
}
