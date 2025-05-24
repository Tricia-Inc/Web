"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import Image from "next/image"
import { LiveKitProvider, useLiveKit } from "@/lib/livekit-context"

interface JournalContent {
  title: string
  date: string
  location: string
  content: string
  images?: string[]
  metadata?: {
    people?: string[]
    emotion?: string
    narrative?: string
  }
}

// Component that handles journal preview with LiveKit connection
function JournalPreviewContent() {
  const router = useRouter()
  const { isConnected, performRpc, room } = useLiveKit()
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const isScrollingRef = useRef(false)
  const [journalData, setJournalData] = useState<JournalContent>({
    title: "My grandson's new puppy",
    date: "Jan. 2nd, 2025",
    location: "Santa Barbara",
    content: "",
  })

  // Get journal data from sessionStorage or RPC
  useEffect(() => {
    // Try to get journal data from sessionStorage (set by RPC)
    const journalPreviewData = sessionStorage.getItem("journalPreview")
    
    if (journalPreviewData) {
      try {
        const parsedData = JSON.parse(journalPreviewData)
        console.log("JournalPreview: Loaded journal data from RPC:", parsedData)
        
        setJournalData({
          title: parsedData.title || "Untitled Story",
          date: parsedData.date || new Date().toLocaleDateString(),
          location: parsedData.location || "Unknown Location",
          content: parsedData.content || parsedData.narrative || "",
          images: parsedData.images || [],
          metadata: {
            people: parsedData.people || [],
            emotion: parsedData.emotion || "",
            narrative: parsedData.narrative || ""
          }
        })
        
        // Set images if available
        if (parsedData.images && parsedData.images.length > 0) {
          setCapturedImages(parsedData.images)
        }
        
        // Don't clear session storage here - keep it for potential re-edits
      } catch (err) {
        console.error("JournalPreview: Error parsing journal data:", err)
      }
    } else {
      // Fallback content for demo
      setJournalData({
        title: "My grandson's new puppy",
        date: "Jan. 2nd, 2025",
        location: "Santa Barbara",
        content: `When my grandson brought home a tiny white puppy named Max, I wasn't sure what to expect. The little furball looked like a snowflake with legs—soft, wiggly, and full of energy. My grandson was beaming with pride, and I could see right away how much he loved that pup. Max quickly made himself at home, exploring every corner of the house, tripping over his own feet, and wagging his tail like he was on a mission to spread joy.

At first, I thought he'd just be another handful. I've raised dogs before, and I know how much work they can be. But there's something special about Max. He follows my grandson everywhere, looking up at him with those big brown eyes full of adoration.

Yesterday, I watched them playing in the backyard. Max was chasing a ball, his little legs working overtime to keep up with his enthusiasm. When he finally caught it, he brought it right back to my grandson, tail wagging so hard his whole body shook. The pure joy on both their faces was something to behold.

I've noticed that having Max around has given my grandson a sense of responsibility. He makes sure the water bowl is always full, that Max gets his meals on time, and he's even set alarms on his phone to remember when it's time for walks. It's wonderful to see him growing through this experience.

I have to admit, Max has won me over too. Last night, he curled up next to me on the couch while we watched TV, his warm little body snuggled against my leg. There's something so comforting about having him there. I think he's going to be a wonderful addition to our family.`,
      })
    }

    // Set default images if none were provided
    if (capturedImages.length === 0) {
      const storedImage = localStorage.getItem("lastCapturedImage")
      const defaultImages = [
        "/back-camera-view.png",
        "/front-camera-view.png",
        "/serene-nature-landscape.png",
        "/cute-puppy.jpg",
      ]

      const images = storedImage ? [storedImage, ...defaultImages.filter((img) => img !== storedImage)] : defaultImages
      setCapturedImages(images)
    }
  }, [])

  // Connect to existing LiveKit room if available
  useEffect(() => {
    // Check if we're already connected from the chat page
    if (room && !isConnected) {
      console.log("JournalPreview: Reconnecting to existing room")
      // Room already exists, just use it
    }
  }, [room, isConnected])

  const handleSaveJournal = async () => {
    if (!isConnected || !performRpc) {
      alert("Not connected to agent. Please go back to chat page.")
      return
    }
    
    try {
      setIsSaving(true)
      console.log("JournalPreview: Saving journal via RPC")
      
      // Call backend's user.save_journal method
      const response = await performRpc('user.save_journal', {
        timestamp: new Date().toISOString()
      })
      
      console.log("JournalPreview: Save journal response:", response)
      
      if (response && !response.error) {
        // Clear the session storage after successful save
        sessionStorage.removeItem('journalPreview')
        
        // Show success and navigate back
        alert("Journal saved successfully!")
        router.push("/chatpage")
      } else {
        throw new Error(response?.error || "Failed to save journal")
      }
      
    } catch (err) {
      console.error("JournalPreview: Error saving journal:", err)
      alert(err instanceof Error ? err.message : "Failed to save journal")
    } finally {
      setIsSaving(false)
    }
  }

  const handleMicrophoneClick = () => {
    if (isSaving) return // Don't toggle while saving
    
    // If we want to save the journal
    if (!isMuted) {
      handleSaveJournal()
    } else {
      setIsMuted(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startYRef.current = e.touches[0].clientY
    isScrollingRef.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = startXRef.current - currentX
    const diffY = startYRef.current - currentY

    // For image swiping, we want to be more responsive to horizontal movements
    // Only consider it a vertical scroll if the vertical movement is significantly greater
    if (!isScrollingRef.current && Math.abs(diffY) > Math.abs(diffX) * 1.5 && Math.abs(diffY) > 20) {
      isScrollingRef.current = true
    }

    // If we're scrolling vertically, don't handle horizontal swipes
    if (isScrollingRef.current) return

    // Make horizontal swipes more responsive by lowering the threshold
    if (Math.abs(diffX) > 30) {
      if (diffX > 0 && currentImageIndex < capturedImages.length - 1) {
        // Swipe left - next image
        setCurrentImageIndex(currentImageIndex + 1)
      } else if (diffX < 0 && currentImageIndex > 0) {
        // Swipe right - previous image
        setCurrentImageIndex(currentImageIndex - 1)
      }
      startXRef.current = currentX
    }
  }

  // Handle scroll events to update the scroll position state
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollY(containerRef.current.scrollTop)
    }
  }

  return (
    <MobileLayout>
      {/* Status Bar - Positioned inside the phone frame */}
      <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center pt-2">
        <div className="text-[17px] font-semibold text-white">9:41</div>
        <div className="flex items-center gap-1">
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 6C1 4.93913 1.42143 3.92172 2.17157 3.17157C2.92172 2.42143 3.93913 2 5 2H13C14.0609 2 15.0783 2.42143 15.8284 3.17157C16.5786 3.92172 17 4.93913 17 6V10C17 11.0609 16.5786 12.0783 15.8284 12.8284C15.0783 13.5786 14.0609 14 13 14H5C3.93913 14 2.92172 13.5786 2.17157 12.8284C1.42143 12.0783 1 11.0609 1 10V6Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M6 14V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 10V10.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 6C19.5523 6 20 6.44772 20 7V9C20 9.55228 19.5523 10 19 10C18.4477 10 18 9.55228 18 9V7C18 6.44772 18.4477 6 19 6Z"
              fill="white"
            />
            <path
              d="M15 3C15.5523 3 16 3.44772 16 4V12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12V4C14 3.44772 14.4477 3 15 3Z"
              fill="white"
            />
            <path
              d="M11 0C11.5523 0 12 0.447715 12 1V15C12 15.5523 11.5523 16 11 16C10.4477 16 10 15.5523 10 15V1C10 0.447715 10.4477 0 11 0Z"
              fill="white"
            />
            <path
              d="M7 4C7.55228 4 8 4.44772 8 5V11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11V5C6 4.44772 6.44772 4 7 4Z"
              fill="white"
            />
            <path
              d="M3 6C3.55228 6 4 6.44772 4 7V9C4 9.55228 3.55228 10 3 10C2.44772 10 2 9.55228 2 9V7C2 6.44772 2.44772 6 3 6Z"
              fill="white"
            />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" />
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="white" />
            <path d="M23 4V8C24.1046 7.66122 25 6.17335 25 5C25 3.82665 24.1046 2.33878 23 2V4Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Back Button - Positioned inside the phone frame */}
      <button onClick={() => router.back()} className="absolute top-20 left-8 z-50" aria-label="Back">
        <div className="w-[60px] h-[60px] rounded-full bg-[rgba(155,155,155,0.38)] flex items-center justify-center">
          <svg width="60" height="49" viewBox="0 0 60 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M26.6657 38.7917L9.99902 24.5M9.99902 24.5L26.6657 10.2083M9.99902 24.5L49.999 24.5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Microphone Button - Positioned inside the phone frame */}
      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-20 h-20 flex items-center justify-center"
        onClick={handleMicrophoneClick}
        style={{ marginBottom: "20px", filter: "drop-shadow(0px 0px 25px #876EE4)" }}
        disabled={isSaving}
      >
        <div className={`absolute inset-0 rounded-full ${isSaving ? "bg-[#828282]" : "bg-[#876EE4]"}`}></div>
        {isSaving ? (
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-white font-medium z-10">SAVE</span>
        )}
      </button>

      {/* Connection status */}
      {!isConnected && (
        <div className="absolute top-24 right-8 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
          Not connected to agent
        </div>
      )}

      <div
        ref={containerRef}
        className="flex flex-col h-full -mx-8 -mt-8 overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          className="relative flex-none"
          style={{ height: `${Math.max(440 - scrollY, 100)}px`, transition: "height 0.1s" }}
        >
          {/* Image Background Section - Full width */}
          <div className="absolute inset-0 bg-black" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            {capturedImages.length > 0 && (
              <div className="absolute inset-0">
                <Image
                  src={capturedImages[currentImageIndex] || "/placeholder.svg"}
                  alt="Journal image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Dot-based Scroll Indicator - Fixed size frame */}
            <div className="absolute bottom-[70px] left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[rgba(224,224,224,0.88)] rounded-full w-[120px] h-[15px] flex items-center justify-center">
                <div className="flex items-center justify-center space-x-2 px-2">
                  {capturedImages.length > 0 && (
                    <>
                      {/* Logic to show maximum 4 dots */}
                      {Array.from({ length: Math.min(4, capturedImages.length) }).map((_, idx) => {
                        // Calculate which dot index to show based on current position
                        let dotIndex = currentImageIndex

                        // If we're at the beginning, show first 4 dots
                        if (currentImageIndex < 2) {
                          dotIndex = idx
                        }
                        // If we're at the end, show last 4 dots
                        else if (currentImageIndex >= capturedImages.length - 2) {
                          dotIndex = capturedImages.length - 4 + idx
                        }
                        // If we're in the middle, show current dot and neighbors
                        else {
                          dotIndex = currentImageIndex - 1 + idx
                        }

                        // Make sure dotIndex is within bounds
                        dotIndex = Math.max(0, Math.min(capturedImages.length - 1, dotIndex))

                        return (
                          <div
                            key={idx}
                            className={`w-[10px] h-[10px] rounded-full ${
                              dotIndex === currentImageIndex ? "bg-white" : "bg-[rgba(224,224,224,0.88)]"
                            } border border-white/50`}
                            onClick={() => setCurrentImageIndex(dotIndex)}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journal Content Container - Full width */}
        <div className="relative flex-1 bg-[#f5f5f5] rounded-t-[40px] -mt-10 px-8 pt-10 pb-20">
          {/* Journal Title */}
          <h1 className="text-[32px] font-bold text-[#2b2b2b] mb-4">{journalData.title}</h1>

          {/* Date and Location */}
          <div className="flex items-center text-[#6f6f6f] text-[18px] mb-8">
            <span>{journalData.date}</span>
            <span className="mx-4">{journalData.location}</span>
          </div>

          {/* People involved (if available from RPC) */}
          {journalData.metadata?.people && journalData.metadata.people.length > 0 && (
            <div className="text-[16px] text-[#9f9f9f] mb-6">
              <span className="font-medium">People: </span>
              {journalData.metadata.people.join(", ")}
            </div>
          )}

          {/* Emotion tag (if available from RPC) */}
          {journalData.metadata?.emotion && (
            <div className="inline-block bg-[#e3dff5] text-[#876EE4] px-4 py-2 rounded-full text-[14px] mb-6">
              {journalData.metadata.emotion}
            </div>
          )}

          {/* Journal Content */}
          <div className="text-[18px] text-[#2b2b2b] leading-relaxed space-y-6">
            {journalData.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}

export default function JournalPreviewPage() {
  return (
    <LiveKitProvider>
      <JournalPreviewContent />
    </LiveKitProvider>
  )
}
