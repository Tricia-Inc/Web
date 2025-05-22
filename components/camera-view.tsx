"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface CameraViewProps {
  isOpen: boolean
  onClose: () => void
}

export function CameraView({ isOpen, onClose }: CameraViewProps) {
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSwipingLeft, setIsSwipingLeft] = useState(false)
  const [isSwipingRight, setIsSwipingRight] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)

  // Reset the view when closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null)
    }
  }, [isOpen])

  const handleSwitchCamera = () => {
    setIsFrontCamera(!isFrontCamera)
  }

  const handleCapture = () => {
    // In a real app, this would capture a photo using the device camera
    // For now, we're simulating it by setting a placeholder or the current camera view
    const newImage = isFrontCamera ? "/front-camera-view.png" : "/back-camera-view.png"
    const newImages = [...capturedImages, newImage]
    setCapturedImages(newImages)
    setCurrentImageIndex(newImages.length - 1)
    setSelectedImage(newImage)

    // Store the last captured image for use in the journal preview
    localStorage.setItem("lastCapturedImage", newImage)
  }

  const handleSelectFromLibrary = () => {
    // In a real app, this would open the device's photo library
    // For now, we're simulating it by setting a placeholder
    const newImage = "/serene-nature-landscape.png"
    const newImages = [...capturedImages, newImage]
    setCapturedImages(newImages)
    setCurrentImageIndex(newImages.length - 1)
    setSelectedImage(newImage)

    // Store the selected image for use in the journal preview
    localStorage.setItem("lastCapturedImage", newImage)
  }

  // Function to navigate to previous image
  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setIsSwipingRight(true)
      setCurrentImageIndex(currentImageIndex - 1)
      setSelectedImage(capturedImages[currentImageIndex - 1])
      setTimeout(() => setIsSwipingRight(false), 300)
    }
  }

  // Function to navigate to next image
  const goToNextImage = () => {
    if (currentImageIndex < capturedImages.length - 1) {
      setIsSwipingLeft(true)
      setCurrentImageIndex(currentImageIndex + 1)
      setSelectedImage(capturedImages[currentImageIndex + 1])
      setTimeout(() => setIsSwipingLeft(false), 300)
    } else if (selectedImage) {
      // If we're at the last image, go back to camera mode
      setSelectedImage(null)
    }
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!selectedImage) return

    const currentX = e.touches[0].clientX
    const diff = startXRef.current - currentX

    // Determine swipe direction
    if (diff > 50) {
      goToNextImage()
      startXRef.current = currentX
    } else if (diff < -50) {
      goToPreviousImage()
      startXRef.current = currentX
    }
  }

  if (!isOpen) return null

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#f5f5f5]">
      {/* Status Bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
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
      <div className="absolute top-20 left-8 right-8 flex justify-between items-center">
        {/* Icon Group (Stars) */}
        <div className="w-10 h-10 flex items-center justify-center">
          <Image src="/icons/icon-group.svg" alt="Icon Group" width={40} height={40} />
        </div>

        {/* User Profile Icon */}
        <div className="w-[45px] h-[45px] flex items-center justify-center">
          <Image src="/icons/user-profile-icon.svg" alt="User Profile" width={45} height={45} />
        </div>
      </div>

      {/* Photo Gallery View with Swipe Navigation */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center mt-20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Previous Image (Left Side) - Moved further left */}
        {capturedImages.length > 0 && currentImageIndex > 0 && (
          <div
            className={`absolute left-[-100px] w-[80px] h-[400px] rounded-[20px] overflow-hidden transition-transform duration-300 ${isSwipingRight ? "translate-x-[-20px]" : ""}`}
            style={{
              backgroundImage: `url('${capturedImages[currentImageIndex - 1]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={goToPreviousImage}
          />
        )}

        {/* Show additional image on the left if there are more than 3 images and we're not at the first or second image */}
        {capturedImages.length > 3 && currentImageIndex > 1 && (
          <div
            className="absolute left-[-160px] w-[60px] h-[300px] rounded-[20px] overflow-hidden opacity-70"
            style={{
              backgroundImage: `url('${capturedImages[currentImageIndex - 2]}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Main Camera/Image View */}
        <div
          className={`relative w-[321px] h-[503px] bg-black rounded-[40px] overflow-hidden transition-transform duration-300 ${isSwipingLeft ? "translate-x-[-20px]" : ""} ${isSwipingRight ? "translate-x-[20px]" : ""}`}
          style={{
            backgroundImage: selectedImage
              ? `url('${selectedImage}')`
              : isFrontCamera
                ? "url('/front-camera-view.png')"
                : "url('/back-camera-view.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Camera feed placeholder - in a real app this would be a camera stream */}
          {!selectedImage && (
            <div className="absolute inset-0 flex items-center justify-center text-white opacity-30">
              {isFrontCamera ? "Front Camera" : "Back Camera"}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-[40px] h-[40px] rounded-full bg-[rgba(235,235,235,0.6)] flex items-center justify-center"
          >
            <Image src="/icons/close-icon.svg" alt="Close" width={24} height={24} />
          </button>

          {capturedImages.length > 0 && currentImageIndex < capturedImages.length - 1 && (
            <div
              className={`absolute right-[-80px] w-[80px] h-[400px] rounded-[20px] overflow-hidden transition-transform duration-300 ${isSwipingLeft ? "translate-x-[20px]" : ""}`}
              style={{
                backgroundImage: `url('${capturedImages[currentImageIndex + 1]}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={goToNextImage}
            />
          )}

          {/* Show additional image on the right if there are more than 3 images and we're not at the last or second-to-last image */}
          {capturedImages.length > 3 && currentImageIndex < capturedImages.length - 2 && (
            <div
              className="absolute right-[-160px] w-[60px] h-[300px] rounded-[20px] overflow-hidden opacity-70"
              style={{
                backgroundImage: `url('${capturedImages[currentImageIndex + 2]}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          {/* Camera Controls - Positioned inside the camera view frame */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-6 pointer-events-none">
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Gallery Button */}
              <button
                className="w-[60px] h-[60px] rounded-full bg-[rgba(156,156,156,0.38)] flex items-center justify-center"
                onClick={handleSelectFromLibrary}
              >
                <Image src="/icons/add-image-icon.svg" alt="Gallery" width={38} height={32} />
              </button>

              {/* Capture Button */}
              <button
                onClick={handleCapture}
                className="w-[70px] h-[70px] rounded-full bg-[rgba(255,252,252,1)] flex items-center justify-center"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-white border-2 border-gray-200"></div>
              </button>

              {/* Switch Camera Button */}
              <button
                onClick={handleSwitchCamera}
                className="w-[60px] h-[60px] rounded-full bg-[rgba(156,156,156,0.38)] flex items-center justify-center"
              >
                <Image src="/icons/refresh-icon.svg" alt="Switch Camera" width={30} height={30} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots - Moved further down below the camera view */}
      {capturedImages.length > 0 && (
        <div className="flex justify-center mt-8 mb-4">
          {capturedImages.map((_, index) => (
            <div
              key={index}
              className={`h-2 mx-1 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? "bg-gray-700 w-8" : "bg-gray-300 w-2"
              }`}
              onClick={() => {
                setCurrentImageIndex(index)
                setSelectedImage(capturedImages[index])
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
