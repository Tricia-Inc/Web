"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/mobile-layout"
import { CameraView } from "@/components/camera-view"
import { VoiceOrbWrapper } from "@/components/voice-orb"
import { LiveKitProvider, useLiveKit } from "@/lib/livekit-context"
import Image from "next/image"
import { Track, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from "livekit-client"

// Agent ID configuration - could come from environment variables or user selection
const DEFAULT_AGENT_ID = "aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d"
const DEFAULT_USER_ID = "Xe9nkrHVetU1lHiK8wt7Ujf6SrH3"

// Remote audio player component
function RemoteAudioPlayer() {
  const { room } = useLiveKit()
  const audioElementRef = useRef<HTMLAudioElement>(null)
  
  useEffect(() => {
    if (!room) return
    
    console.log("RemoteAudio: Setting up audio track handlers")
    
    // Function to handle new audio tracks
    const handleTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log("RemoteAudio: Track subscribed:", {
        kind: track.kind,
        name: publication.trackName,
        participant: participant.identity
      })
      
      // Only process audio tracks
      if (track.kind !== Track.Kind.Audio) return
      
      console.log("RemoteAudio: Audio track detected, attaching to audio element")
      
      // Create audio element if not exists
      if (!audioElementRef.current) {
        const audioEl = document.createElement('audio')
        audioEl.autoplay = true
        audioEl.muted = false
        audioEl.volume = 1.0
        document.body.appendChild(audioEl)
        audioElementRef.current = audioEl
        console.log("RemoteAudio: Created new audio element")
      }
      
      // Attach track to audio element
      track.attach(audioElementRef.current)
      console.log("RemoteAudio: Attached track to audio element")
    }
    
    // Function to handle track unsubscribed
    const handleTrackUnsubscribed = (track: RemoteTrack) => {
      console.log("RemoteAudio: Track unsubscribed")
      
      if (track.kind === Track.Kind.Audio && audioElementRef.current) {
        track.detach(audioElementRef.current)
        console.log("RemoteAudio: Detached track from audio element")
      }
    }
    
    // Register event handlers for all existing participants
    if (room.remoteParticipants) {
      room.remoteParticipants.forEach((participant: RemoteParticipant) => {
        console.log("RemoteAudio: Checking existing participant:", participant.identity)
        
        // Get all audio tracks from the participant
        const audioTracks = Array.from(participant.getTrackPublications().values())
          .filter(pub => pub.kind === Track.Kind.Audio)
        
        audioTracks.forEach((publication) => {
          if (publication.isSubscribed && publication.track) {
            // Safe to cast here as we filtered for audio tracks above
            handleTrackSubscribed(
              publication.track as RemoteTrack, 
              publication as RemoteTrackPublication, 
              participant
            )
          }
        })
      })
    }
    
    // Register event listeners for new tracks
    room.on('trackSubscribed', handleTrackSubscribed)
    room.on('trackUnsubscribed', handleTrackUnsubscribed)
    
    return () => {
      console.log("RemoteAudio: Cleaning up event listeners")
      // Clean up event listeners
      room.off('trackSubscribed', handleTrackSubscribed)
      room.off('trackUnsubscribed', handleTrackUnsubscribed)
      
      // Clean up audio element
      if (audioElementRef.current) {
        const audioEl = audioElementRef.current
        if (audioEl.parentNode) {
          audioEl.parentNode.removeChild(audioEl)
        }
        audioElementRef.current = null
      }
    }
  }, [room])
  
  return null // This component doesn't render anything visible
}

// ChatRoom component with LiveKit integration
function ChatRoom() {
  const router = useRouter()
  const { 
    toggleMicrophone, 
    isMicrophoneEnabled, 
    connect, 
    isConnected, 
    isConnecting, 
    error, 
    room,
    registerRpcMethod,
    performRpc
  } = useLiveKit()
  const [cameraActive, setCameraActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isOrbActive, setIsOrbActive] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success'|'error'|null}>({text: '', type: null})
  const [agentDetected, setAgentDetected] = useState(false)
  const [agentActive, setAgentActive] = useState(false)
  const [userId] = useState(DEFAULT_USER_ID) // Use the specified user ID
  const [isGeneratingJournal, setIsGeneratingJournal] = useState(false)

  // Connect to a chat with the agent when component mounts
  useEffect(() => {
    // Only try to connect if the room object is available (created on client-side)
    if (room) {
      // Generate unique session/chat identifier
      const chatRoomId = `chat-${Date.now()}`
      console.log("ChatPage: Creating chat with agent:", DEFAULT_AGENT_ID)
      console.log("ChatPage: Using user ID:", userId)
      
      // Connect with unique user ID to ensure consistent identity
      connect(chatRoomId, userId, DEFAULT_AGENT_ID)
    }
  }, [connect, room, userId])

  // Register RPC methods when connected
  useEffect(() => {
    if (!isConnected || !registerRpcMethod) return
    
    console.log("ChatPage: Registering RPC methods")
    
    // Backend calls this when journal is generated
    registerRpcMethod('agent.journal_generated', async (data) => {
      console.log("ChatPage: Received journal via RPC (agent.journal_generated):", data)
      
      try {
        // Parse the data - backend sends JSON string in payload
        const parsedData = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload
        
        console.log("ChatPage: Parsed journal data:", parsedData)
        
        // Store journal data in session storage for the preview page
        sessionStorage.setItem('journalPreview', JSON.stringify(parsedData))
        
        // Navigate to journal preview page
        setStatusMessage({
          text: "Journal generated! Redirecting...",
          type: 'success'
        })
        
        setTimeout(() => {
          router.push("/journal-preview")
        }, 1000)
        
        return JSON.stringify({ status: "success", message: "Journal preview received" })
      } catch (err) {
        console.error("ChatPage: Error handling journal preview:", err)
        return JSON.stringify({ status: "error", message: String(err) })
      }
    })
    
    // Backend calls this when journal is saved
    registerRpcMethod('agent.journal_saved', async (data) => {
      console.log("ChatPage: Received journal saved notification via RPC:", data)
      
      try {
        const parsedData = typeof data.payload === 'string' ? JSON.parse(data.payload) : data.payload
        
        setStatusMessage({
          text: "Journal saved successfully!",
          type: 'success'
        })
        
        // Optionally navigate to a success page or stay on current page
        // router.push("/profile") // or wherever you want to go after save
        
        return JSON.stringify({ status: "success", message: "Journal saved notification received" })
      } catch (err) {
        console.error("ChatPage: Error handling journal saved:", err)
        return JSON.stringify({ status: "error", message: String(err) })
      }
    })
    
  }, [isConnected, registerRpcMethod, router])

  // Display connection error to the user
  useEffect(() => {
    if (error) {
      console.error("ChatPage: Connection error:", error.message)
      setStatusMessage({
        text: `Connection error: ${error.message.substring(0, 50)}${error.message.length > 50 ? '...' : ''}`,
        type: 'error'
      })
    }
  }, [error])

  // Monitor for agent participants
  useEffect(() => {
    if (!room || !isConnected) {
      setAgentDetected(false)
      setAgentActive(false)
      return
    }

    // Check for existing remote participants when we connect
    const checkForAgent = () => {
      const remoteParticipants = room.remoteParticipants
      console.log("ChatPage: Remote participants:", remoteParticipants)
      
      // Consider any remote participant as a potential agent
      if (remoteParticipants && remoteParticipants.size > 0) {
        console.log("ChatPage: Agent detected in room")
        setAgentDetected(true)
        
        // Check if any remote participant has active audio tracks
        let hasActiveAudio = false
        remoteParticipants.forEach(participant => {
          // Use getTrackPublications to get all track publications
          const audioPublications = participant.getTrackPublications().filter(
            publication => publication.kind === 'audio'
          )
          
          audioPublications.forEach(publication => {
            if (publication.track && !publication.isMuted) {
              console.log("ChatPage: Agent has active audio track")
              hasActiveAudio = true
            }
          })
        })
        
        setAgentActive(hasActiveAudio)
      } else {
        console.log("ChatPage: No agent detected in room")
        setAgentDetected(false)
        setAgentActive(false)
      }
    }
    
    // Check initially
    checkForAgent()
    
    // Set up listeners for participant changes
    const handleParticipantConnected = () => {
      console.log("ChatPage: A new participant connected")
      checkForAgent()
    }
    
    const handleParticipantDisconnected = () => {
      console.log("ChatPage: A participant disconnected")
      checkForAgent()
    }
    
    const handleTrackSubscribed = () => {
      console.log("ChatPage: New track subscribed")
      checkForAgent()
    }
    
    const handleTrackUnsubscribed = () => {
      console.log("ChatPage: Track unsubscribed")
      checkForAgent()
    }
    
    // Add listeners
    room.on('participantConnected', handleParticipantConnected)
    room.on('participantDisconnected', handleParticipantDisconnected)
    room.on('trackSubscribed', handleTrackSubscribed)
    room.on('trackUnsubscribed', handleTrackUnsubscribed)
    
    return () => {
      // Remove listeners
      room.off('participantConnected', handleParticipantConnected)
      room.off('participantDisconnected', handleParticipantDisconnected)
      room.off('trackSubscribed', handleTrackSubscribed)
      room.off('trackUnsubscribed', handleTrackUnsubscribed)
    }
  }, [room, isConnected])

  // Clear status message after timeout
  useEffect(() => {
    if (statusMessage.text) {
      const timer = setTimeout(() => {
        setStatusMessage({text: '', type: null})
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage.text])

  const handleCameraClick = async () => {
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

  const handleJournalClick = async () => {
    if (!isConnected || !performRpc || !agentDetected) {
      setStatusMessage({
        text: "Please wait for agent to connect",
        type: 'error'
      })
      return
    }
    
    try {
      setIsGeneratingJournal(true)
      setStatusMessage({
        text: "Generating journal...",
        type: 'success'
      })
      
      console.log("ChatPage: Requesting journal generation via RPC")
      
      // Call backend's user.generate_journal method
      const response = await performRpc('user.generate_journal', {
        user_id: userId,
        timestamp: new Date().toISOString()
      })
      
      console.log("ChatPage: Journal generation response:", response)
      
      // Backend will send the journal via agent.journal_generated RPC
      // Response contains the journal data
      if (response && !response.error) {
        // Journal was generated successfully
        console.log("ChatPage: Journal generated successfully")
      } else {
        throw new Error(response?.error || "Failed to generate journal")
      }
      
    } catch (err) {
      console.error("ChatPage: Error generating journal:", err)
      setStatusMessage({
        text: err instanceof Error ? err.message : "Failed to generate journal",
        type: 'error'
      })
    } finally {
      setIsGeneratingJournal(false)
    }
  }

  const handleIconGroupClick = () => {
    router.push("/community")
  }

  const handleMicrophoneClick = async () => {
    try {
      console.log("ChatPage: Toggling microphone")
      const enabled = await toggleMicrophone()
      // Update UI state
      setIsOrbActive(enabled)
      setStatusMessage({
        text: enabled ? "Voice activated" : "Voice muted",
        type: 'success'
      })
      
      if (enabled && !agentDetected) {
        console.log("ChatPage: Microphone enabled but no agent detected")
        setTimeout(() => {
          setStatusMessage({
            text: "Waiting for agent to connect...",
            type: 'success'
          })
        }, 3500)
      }
    } catch (err) {
      console.error("ChatPage: Error toggling microphone:", err)
      setStatusMessage({
        text: "Failed to toggle microphone",
        type: 'error'
      })
    }
  }

  const handleOrbClick = () => {
    handleMicrophoneClick()
  }

  // Add function to handle image capture
  const handleImageCapture = async (imageUrl: string) => {
    if (!isConnected || !performRpc || !agentDetected) {
      setStatusMessage({
        text: "Please wait for agent to connect",
        type: 'error'
      })
      return
    }
    
    try {
      console.log("ChatPage: Sending image to agent via RPC")
      
      // Call backend's user.add_image method
      const response = await performRpc('user.add_image', {
        image_url: imageUrl
      })
      
      console.log("ChatPage: Add image response:", response)
      
      if (response?.status === 'success') {
        setStatusMessage({
          text: "Image added to journal",
          type: 'success'
        })
      } else {
        throw new Error(response?.message || "Failed to add image")
      }
      
    } catch (err) {
      console.error("ChatPage: Error adding image:", err)
      setStatusMessage({
        text: err instanceof Error ? err.message : "Failed to add image",
        type: 'error'
      })
    }
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

          {/* Journal Icon - Now with loading state */}
          <button 
            className="w-12 h-12 flex items-center justify-center" 
            onClick={handleJournalClick}
            disabled={isGeneratingJournal}
          >
            <div className="relative">
              <Image 
                src="/icons/journal-icon.svg" 
                alt="Generate Journal" 
                width={37} 
                height={38}
                className={isGeneratingJournal ? "opacity-50" : ""}
              />
              {isGeneratingJournal && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 border-2 border-[#606060] rounded-sm opacity-0"></div>
            </div>
          </button>
        </div>

        {/* Remote audio player - invisible but handles audio playback */}
        <RemoteAudioPlayer />
      </div>

      {/* Camera View Overlay */}
      <div className={`absolute inset-0 bottom-[80px] z-40 ${showCamera ? "block" : "hidden"}`}>
        <CameraView 
          isOpen={showCamera} 
          onClose={handleCloseCamera}
          onCapture={handleImageCapture}
        />
      </div>

      {/* Status message toast */}
      {statusMessage.text && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            statusMessage.type === 'error' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {statusMessage.text}
          </div>
        </div>
      )}

      {/* Connection status indicator */}
      {!isConnected && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
            Connecting to voice service...
          </div>
        </div>
      )}

      {/* Agent status indicators */}
      {isConnected && isMicrophoneEnabled && !agentDetected && (
        <div className="absolute top-24 left-0 right-0 flex justify-center">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
            Waiting for agent to join...
          </div>
        </div>
      )}
      
      {isConnected && agentDetected && (
        <div className="absolute top-24 left-0 right-0 flex justify-center">
          <div className={`px-3 py-1 rounded-full text-xs ${
            agentActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {agentActive ? 'Agent speaking...' : 'Agent connected'}
          </div>
        </div>
      )}

      {/* Show connecting indicator */}
      {isConnecting && (
        <div className="absolute top-24 left-0 right-0 flex justify-center">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs animate-pulse">
            Connecting to voice assistant...
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
