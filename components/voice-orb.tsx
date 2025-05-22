"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { useLiveKit } from "@/lib/livekit-context"

// SVG paths for each layer
const SVG_DATA = [
  {
    path: "M89.0032 0.702874C138.196 0.878103 178.215 40.5393 178.39 89.2887C178.568 139.16 149.233 155.385 110.933 155.249C87.329 155.165 77.6233 180.888 51.7497 168.76C21.4353 154.55 0.374453 123.99 0.248061 88.6542C0.0736891 39.9048 39.8108 0.527645 89.0032 0.702874Z",
    viewBox: "0 0 179 173",
    size: { width: 180, height: 173 },
    color: "#FCE4FF", // Lightest purple
    baseRotation: -10,
  },
  {
    path: "M140.42 165.772C99.3056 194.768 42.5728 185.081 13.7035 144.134C-15.8305 102.244 10.1507 76.9424 20.3051 45.8626C25.1304 31.0937 37.878 11.6366 72.4552 2.1857C106.1 -3.80882 140.921 9.97266 161.846 39.6527C190.716 80.5996 181.534 136.775 140.42 165.772Z",
    viewBox: "0 0 179 183",
    size: { width: 179, height: 183 },
    color: "#B3A0FB",
    baseRotation: 6,
  },
  {
    path: "M135.415 172.205C90.9314 195.763 35.3776 178.135 11.8581 133.82C-11.6613 89.5052 1.20931 41.293 45.6933 17.7347C57.7756 11.336 74.7677 1.10659 87.5739 0.407991C121.917 -1.46538 155.818 16.2289 172.949 48.5074C196.469 92.8222 179.899 148.647 135.415 172.205Z",
    viewBox: "0 0 184 183",
    size: { width: 184, height: 183 },
    color: "#DF7AF8",
    baseRotation: -5,
  },
  {
    path: "M4.80212 57.703C20.1213 13.1365 68.5219 -10.6178 112.908 4.64657C158.316 20.2624 169.489 57.0403 157.562 91.7392C150.211 113.123 160.78 130.744 146.151 144.663C122.962 166.726 89.6049 177.101 57.4323 166.037C13.0463 150.772 -10.517 102.27 4.80212 57.703Z",
    viewBox: "0 0 162 171",
    size: { width: 162, height: 171 },
    color: "#F9C3FF",
    baseRotation: 8,
  },
  {
    path: "M114.097 177.403C65.3829 189.513 15.8444 160.06 3.45042 111.619C-9.22896 62.063 18.8541 23.3217 56.7825 13.8936C80.1571 8.0833 97.334 -1.78275 108.824 0.957395C142.084 8.8893 170.878 32.6558 179.862 67.7676C192.256 116.208 162.812 165.294 114.097 177.403Z",
    viewBox: "0 0 183 181",
    size: { width: 183, height: 181 },
    color: "#F2A9FA",
    baseRotation: -12,
  },
  {
    path: "M46.3175 9.22347C55.6138 20.2787 54.208 36.9698 43.257 46.2437C32.3061 55.5176 26.1608 44.8071 21.0102 40.5792C16.0782 36.5307 4.72272 41.3921 1.31708 32.9234C-2.08855 24.4548 1.82288 13.1315 9.76054 6.40939C20.7115 -2.8645 37.0212 -1.83174 46.3175 9.22347Z",
    viewBox: "0 0 53 50",
    size: { width: 53, height: 50 },
    color: "#4E38B2",
    baseRotation: 4,
  },
  {
    path: "M0.563795 71.964C5.25534 28.1252 42.8417 -3.87787 86.4636 0.687341C133.459 5.60563 127.881 39.9317 141.754 67.6767C149.198 88.9948 159.646 93.0272 145.876 121.285C130.371 146.935 101.178 161.957 69.559 158.648C25.937 154.083 -4.12775 115.803 0.563795 71.964Z",
    viewBox: "0 0 153 160",
    size: { width: 153, height: 160 },
    color: "#876EE4",
    baseRotation: -7,
  },
  {
    path: "M48.8102 106.901C17.4393 101.489 -4.00959 72.9562 1.13253 41.7777C6.39304 9.88133 34.5981 11.2935 46.5953 8.92493C58.5918 6.55636 71.3563 -6.78057 90.5058 4.62488C108.318 16.9733 117.896 38.6782 114.169 61.2775C109.027 92.456 80.181 112.313 48.8102 106.901Z",
    viewBox: "0 0 115 108",
    size: { width: 115, height: 108 },
    color: "#321B9A", // Darkest purple
    baseRotation: 3,
  },
]

interface VoiceOrbLayerProps {
  path: string;
  viewBox: string;
  size: { width: number; height: number };
  color: string;
  baseRotation: number;
  zIndex: number;
  isAnimating: boolean;
  intensity: number;
  index: number;
}

// Reusable VoiceOrbLayer component
const VoiceOrbLayer = ({ 
  path, 
  viewBox, 
  size, 
  color, 
  baseRotation, 
  zIndex, 
  isAnimating, 
  intensity, 
  index 
}: VoiceOrbLayerProps) => {
  // Generate random values for animations
  const generateRandomValues = () => {
    // Scale between 1.03 and 1.12, adjusted by intensity
    const scale = 1.03 + ((index / 8) * 0.09 * intensity)

    // Random X/Y offsets between -12 and 12, adjusted by intensity
    const x = (Math.random() * 24 - 12) * ((index / 8) + 0.5) * intensity
    const y = (Math.random() * 24 - 12) * ((index / 8) + 0.5) * intensity

    // Opacity between 0.85 and 1.0
    const opacity = 0.85 + (Math.random() * 0.15 * intensity)

    // Rotation ±8° from base
    const rotation = baseRotation + ((Math.random() * 16 - 8) * intensity)

    // Duration between 2.5s and 5s
    const duration = 2.5 + (Math.random() * 2.5)

    return { scale, x, y, opacity, rotation, duration }
  }

  // Create animation variants
  const values = generateRandomValues()
  const variants: Variants = {
    inactive: {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 0.9,
      rotate: baseRotation,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    active: {
      scale: values.scale,
      x: values.x,
      y: values.y,
      opacity: values.opacity,
      rotate: values.rotation,
      transition: {
        duration: values.duration,
        delay: index * 0.08,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  }

  // Calculate position to center the layer
  const left = (200 - size.width) / 2
  const top = (200 - size.height) / 2

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        transformOrigin: "center",
      }}
      initial="inactive"
      animate={isAnimating ? "active" : "inactive"}
      variants={variants}
    >
      <path d={path} fill={color} />
    </motion.svg>
  )
}

// Main VoiceOrbWrapper component
export const VoiceOrbWrapper = ({ isActive = false, onClick = () => {} }) => {
  const [isAnimating, setIsAnimating] = useState(isActive)
  const { audioLevel, isMicrophoneEnabled } = useLiveKit()
  
  // Calculate animation intensity based on audio level
  const [intensity, setIntensity] = useState(1)
  
  useEffect(() => {
    // Update animation state based on LiveKit microphone state
    setIsAnimating(isMicrophoneEnabled)
    
    // Calculate animation intensity based on audio level (0-1)
    if (isMicrophoneEnabled && audioLevel > 0) {
      // Map audioLevel (0-1) to intensity (0.5-2.0)
      const newIntensity = 0.5 + (audioLevel * 1.5)
      setIntensity(newIntensity)
    } else {
      setIntensity(1)
    }
  }, [audioLevel, isMicrophoneEnabled])

  const handleClick = () => {
    setIsAnimating(!isAnimating)
    onClick()
  }

  return (
    <div className="relative w-[200px] h-[200px] mx-auto cursor-pointer overflow-visible" onClick={handleClick}>
      {SVG_DATA.map((layer, index) => (
        <VoiceOrbLayer
          key={index}
          path={layer.path}
          viewBox={layer.viewBox}
          size={layer.size}
          color={layer.color}
          baseRotation={layer.baseRotation}
          zIndex={index + 1}
          isAnimating={isAnimating}
          intensity={intensity}
          index={index}
        />
      ))}
    </div>
  )
}
