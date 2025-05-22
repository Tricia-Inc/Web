"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Track } from 'livekit-client';

interface LiveKitContextType {
  room: Room | null;
  connect: (roomName: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  audioLevel: number;
  toggleMicrophone: () => Promise<boolean>;
  isMicrophoneEnabled: boolean;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export function LiveKitProvider({ children }: { children: ReactNode }) {
  const [room] = useState(new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);

  // Monitor audio levels
  useEffect(() => {
    if (!isConnected || !room) return;

    // Set up an interval to check audio levels for active speaking
    const audioMonitor = setInterval(() => {
      if (room.localParticipant && isMicrophoneEnabled) {
        // This is a simplified approach - in a real app you'd want to use
        // the actual audio analyzer from LiveKit
        const level = Math.random() * 0.5; // Simulate audio levels between 0 and 0.5
        setAudioLevel(level);
      } else {
        setAudioLevel(0);
      }
    }, 100);

    return () => clearInterval(audioMonitor);
  }, [isConnected, room, isMicrophoneEnabled]);

  // Connect to a room
  const connect = async (roomName: string) => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Get token from your backend
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName }),
      });
      
      if (!response.ok) throw new Error('Failed to get token');
      
      const { token } = await response.json();
      
      // Connect to LiveKit room
      await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://your-livekit-instance.livekit.cloud', token);
      
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Connection failed'));
      console.error('LiveKit connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnect = () => {
    room.disconnect();
    setIsConnected(false);
  };

  const toggleMicrophone = async (): Promise<boolean> => {
    if (!room || !isConnected) return false;
    
    try {
      const enabled = !isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsMicrophoneEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      return isMicrophoneEnabled;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      room.disconnect();
    };
  }, [room]);

  return (
    <LiveKitContext.Provider value={{
      room,
      connect,
      disconnect,
      isConnected,
      isConnecting,
      error,
      audioLevel,
      toggleMicrophone,
      isMicrophoneEnabled
    }}>
      {children}
    </LiveKitContext.Provider>
  );
}

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error('useLiveKit must be used within a LiveKitProvider');
  }
  return context;
}; 