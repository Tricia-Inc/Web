"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Track, ConnectionState, RoomEvent } from 'livekit-client';

interface LiveKitContextType {
  room: Room | null;
  connect: (roomName: string, identity?: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  audioLevel: number;
  toggleMicrophone: () => Promise<boolean>;
  isMicrophoneEnabled: boolean;
  connectionState: ConnectionState;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export function LiveKitProvider({ children }: { children: ReactNode }) {
  const [room] = useState(new Room({
    adaptiveStream: true,
    dynacast: true,
  }));
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);

  // Monitor room connection state
  useEffect(() => {
    if (!room) return;

    const handleConnectionStateChanged = (state: ConnectionState) => {
      console.log(`LiveKit connection state: ${state}`);
      setConnectionState(state);
      
      if (state === ConnectionState.Connected) {
        setIsConnected(true);
        setIsConnecting(false);
      } else if (state === ConnectionState.Connecting) {
        setIsConnecting(true);
      } else {
        setIsConnected(false);
        setIsConnecting(false);
      }
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsMicrophoneEnabled(false);
      setAudioLevel(0);
    };

    const handleError = (err: Error) => {
      console.error('LiveKit room error:', err);
      setError(err);
    };
    
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.MediaDevicesError, handleError);
    room.on(RoomEvent.SignalConnected, () => console.log('Signal connected'));
    
    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.MediaDevicesError, handleError);
      room.off(RoomEvent.SignalConnected, () => {});
    };
  }, [room]);

  // Monitor audio levels using a timer instead of events
  useEffect(() => {
    if (!isConnected || !room) return;

    // Set up an interval to simulate audio levels when microphone is active
    const audioMonitor = setInterval(() => {
      if (isMicrophoneEnabled) {
        // This is a simplified approach - in a real implementation,
        // we would use proper audio analyzers but for UI demonstration
        // purposes, we'll generate random values
        const level = Math.random() * 0.5; // Random level between 0 and 0.5
        setAudioLevel(level);
      } else {
        setAudioLevel(0);
      }
    }, 100);

    return () => clearInterval(audioMonitor);
  }, [isConnected, room, isMicrophoneEnabled]);

  // Connect to a LiveKit room
  const connect = async (roomName: string, identity?: string) => {
    if (isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Get token from API
      const response = await fetch('/api/livekit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomName,
          identity: identity || `user-${Date.now()}`,
          metadata: {
            name: 'Anonymous User',
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }
      
      const { token, serverUrl } = await response.json();
      
      if (!token || !serverUrl) {
        throw new Error('Invalid token response');
      }
      
      // Connect to LiveKit room
      await room.connect(serverUrl, token, {
        autoSubscribe: true,
      });
      
      console.log('Connected to LiveKit room:', roomName);
      
      // Update connection state (redundant with event handler, but kept for safety)
      setIsConnected(true);
      setIsConnecting(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Connection failed');
      console.error('LiveKit connection failed:', error);
      setError(error);
      setIsConnecting(false);
      setIsConnected(false);
    }
  };
  
  // Disconnect from LiveKit room
  const disconnect = () => {
    if (room) {
      room.disconnect();
      setIsConnected(false);
      setIsMicrophoneEnabled(false);
    }
  };

  // Toggle microphone state
  const toggleMicrophone = async (): Promise<boolean> => {
    if (!room || !isConnected) return false;
    
    try {
      const enabled = !isMicrophoneEnabled;
      
      // Request microphone permissions if needed
      if (enabled) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      await room.localParticipant.setMicrophoneEnabled(enabled);
      setIsMicrophoneEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error('Failed to toggle microphone:', err);
      setError(err instanceof Error ? err : new Error('Microphone access failed'));
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
      isMicrophoneEnabled,
      connectionState
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