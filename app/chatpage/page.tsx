"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { CameraView } from "@/components/camera-view"
import { VoiceOrbWrapper } from "@/components/voice-orb"
import { LiveKitProvider, useLiveKit } from "@/lib/livekit-context"
import Image from "next/image"

// ChatRoom component with LiveKit integration
function ChatRoom() {
  const router = useRouter()
  const { toggleMicrophone, isMicrophoneEnabled, connect, isConnected } = useLiveKit()
  const [cameraActive, setCameraActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isOrbActive, setIsOrbActive] = useState(false)

  // Connect to a default chat room on component mount
  useEffect(() => {
    const defaultRoom = "default-chat-room"
    connect(defaultRoom)
  }, [connect])

  const handleCameraClick = () => {
    // If camera is already open, just toggle animation
    if (showCamera) {
      setCameraActive(true)
      setTimeout(() => setCameraActive(false), 300)
    } else {
      // Otherwise activate it with animation
      setCameraActive(true)
      setShowCamera(true)
      // Reset the animation after a short delay
      setTimeout(() => setCameraActive(false), 300)
    }
  }

  const handleCloseCamera = () => {
    setShowCamera(false)
  }

  const handleJournalClick = () => {
    // Navigate to journal preview page
    router.push("/journal-preview")
  }

  const handleIconGroupClick = () => {
    router.push("/community")
  }

  const handleMicrophoneClick = async () => {
    try {
      const enabled = await toggleMicrophone()
      // Update UI state
      setIsOrbActive(enabled)
      if (enabled) {
        alert("Voice activated")
      } else {
        alert("Voice muted")
      }
    } catch (err) {
      console.error("Error toggling microphone:", err)
      alert("Failed to toggle microphone")
    }
  }

  const handleOrbClick = () => {
    handleMicrophoneClick()
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

        {/* Top Navigation Icons */}
        <div className="flex justify-between items-center mb-6 relative z-50">
          {/* Icon Group (Stars) */}
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer" onClick={handleIconGroupClick}>
            <Image src="/icons/icon-group.svg" alt="Icon Group" width={40} height={40} />
          </div>

          {/* User Profile Icon */}
          <div className="w-[45px] h-[45px] flex items-center justify-center" onClick={() => router.push("/profile")}>
            <Image src="/icons/user-profile-icon.svg" alt="User Profile" width={45} height={45} />
          </div>
        </div>

        {/* Main Content Area with Voice Orb */}
        <div className="flex-1 flex items-center justify-center">
          <VoiceOrbWrapper isActive={isOrbActive} onClick={handleOrbClick} />
        </div>

        {/* Bottom Navigation - Positioned lower */}
        <div className="flex justify-between items-center px-8 py-2 mb-2 relative z-50">
          {/* Camera Icon */}
          <button
            className={`w-12 h-12 flex items-center justify-center transition-transform ${cameraActive ? "scale-90" : ""}`}
            onClick={handleCameraClick}
          >
            <Image src="/icons/camera-icon.svg" alt="Camera" width={50} height={50} />
          </button>

          {/* Microphone Button - Now toggles between muted and unmuted */}
          <button className="relative w-20 h-20 flex items-center justify-center" onClick={handleMicrophoneClick}>
            <div className={`absolute inset-0 rounded-full ${!isMicrophoneEnabled ? "bg-[#828282]" : "bg-[#2b2b2b]"}`}></div>
            {!isMicrophoneEnabled ? (
              <svg
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <path
                  d="M17.2046 6.30757C18.362 5.1502 19.9317 4.5 21.5685 4.5C23.2053 4.5 24.775 5.1502 25.9324 6.30757C27.0897 7.46494 27.7399 9.03466 27.7399 10.6714V16.875M7.3125 20.9571C7.81093 24.3818 9.52572 27.5126 12.1432 29.7767C14.7606 32.0407 18.1057 33.2867 21.5664 33.2867M21.5664 33.2867C25.0272 33.2867 28.3723 32.0407 30.9897 29.7767C33.6072 27.5126 35.322 24.3818 35.8204 20.9571M21.5664 33.2867V40.5M15.3971 14.625V18.9C15.3971 20.5368 16.0473 22.1065 17.2046 23.2639C18.362 24.4212 19.9317 25.0714 21.5685 25.0714C22.6157 25.0714 23.6355 24.8053 24.5373 24.3104M6.1875 4.5L38.8125 37.125"
                  stroke="#E88383"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <Image
                src="/icons/microphone-icon.svg"
                alt="Microphone"
                width={45}
                height={45}
                className="relative z-10"
              />
            )}
          </button>

          {/* Journal Icon */}
          <button className="w-12 h-12 flex items-center justify-center" onClick={handleJournalClick}>
            <div className="relative">
              <Image src="/icons/journal-icon.svg" alt="Generate Journal" width={37} height={38} />
              <div className="absolute inset-0 border-2 border-[#606060] rounded-sm opacity-0"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Camera View Overlay */}
      <div className={`absolute inset-0 bottom-[80px] z-40 ${showCamera ? "block" : "hidden"}`}>
        <CameraView isOpen={showCamera} onClose={handleCloseCamera} />
      </div>

      {/* Connection status indicator (optional) */}
      {!isConnected && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
            Connecting to voice service...
          </div>
        </div>
      )}
    </MobileLayout>
  )
}

// Wrap with LiveKit provider
export default function ChatPage() {
  return (
    <LiveKitProvider>
      <ChatRoom />
    </LiveKitProvider>
  )
}
