"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"

export default function ChatPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")

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

        {/* Header with navigation buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/community")}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#2b2b2b]"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </button>

          <div className="text-xl font-medium text-[#2b2b2b]">Tricia</div>

          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#2b2b2b]"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto mb-4 bg-[#f9f9f9] rounded-lg p-4">
          {/* Assistant message */}
          <div className="flex mb-4">
            <div className="w-8 h-8 rounded-full bg-[#2b2b2b] flex items-center justify-center text-white mr-2">T</div>
            <div className="bg-white p-3 rounded-lg rounded-tl-none max-w-[80%] shadow-sm">
              <p className="text-[#2b2b2b]">
                Hi there! I'm Tricia, your personal journaling companion. How are you feeling today?
              </p>
            </div>
          </div>

          {/* User can add more messages here */}
        </div>

        {/* Input area with bottom buttons */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border-none outline-none text-[#2b2b2b]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => alert("Camera")}
            className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#2b2b2b]"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </button>

          <button
            onClick={() => router.push("/record")}
            className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#2b2b2b]"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <button
            onClick={() => alert("Generate Journal")}
            className="w-12 h-12 rounded-full bg-[#2b2b2b] flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        </div>
      </div>
    </MobileLayout>
  )
}
