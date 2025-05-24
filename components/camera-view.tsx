"use client"

import { useState, useEffect, useRef } from "react"

interface CameraViewProps {
  isOpen: boolean
  onClose: () => void
  onCapture?: (imageDataUrl: string) => void
}

export function CameraView({ isOpen, onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Start camera when component mounts and isOpen is true
  useEffect(() => {
    let stream: MediaStream | null = null

    if (isOpen && !cameraStream) {
      navigator.mediaDevices
        .getUserMedia({ 
          video: { 
            facingMode: "environment", // Use back camera by default
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }, 
          audio: false 
        })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
            setCameraStream(mediaStream)
            setCameraReady(true)
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          // Fallback to any available camera
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((mediaStream) => {
              if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                setCameraStream(mediaStream)
                setCameraReady(true)
              }
            })
        })
    }

    // Cleanup function
    return () => {
      if (!isOpen && cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
        setCameraStream(null)
        setCameraReady(false)
      }
    }
  }, [isOpen, cameraStream])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return

    setIsCapturing(true)
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Convert to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(imageDataUrl)
    
    // Call the onCapture callback if provided
    if (onCapture) {
      onCapture(imageDataUrl)
    }
    
    // Show captured state briefly
    setTimeout(() => {
      setIsCapturing(false)
      setCapturedImage(null)
    }, 1500)
  }

  const handleClose = () => {
    // Stop camera stream before closing
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    onClose()
  }

  return (
    <div className={`absolute inset-0 z-50 bg-black ${isOpen ? "block" : "hidden"}`}>
      <div className="relative h-full w-full">
        {/* Camera feed or captured image */}
        {capturedImage && isCapturing ? (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="h-full w-full object-cover"
          />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-8 right-8 z-10 rounded-full bg-black/50 p-3"
          aria-label="Close camera"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        {/* Capture button */}
        {cameraReady && !isCapturing && (
          <button
            onClick={handleCapture}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg"
            aria-label="Capture photo"
          >
            <div className="w-16 h-16 rounded-full bg-white mx-auto" />
          </button>
        )}
        
        {/* Capture feedback */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full font-medium">
              Photo captured!
            </div>
          </div>
        )}
        
        {/* Camera not ready indicator */}
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-lg">Loading camera...</div>
          </div>
        )}
      </div>
    </div>
  )
}
