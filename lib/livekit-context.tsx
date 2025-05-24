"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Room, Track, ConnectionState, RoomEvent, Participant, ParticipantEvent, RemoteParticipant, TrackPublication, RemoteTrack } from 'livekit-client';

interface LiveKitContextType {
  room: Room | null;
  connect: (roomName: string, identity?: string, agentId?: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  audioLevel: number;
  toggleMicrophone: () => Promise<boolean>;
  isMicrophoneEnabled: boolean;
  connectionState: ConnectionState;
  registerRpcMethod: (method: string, handler: (data: any) => Promise<any>) => void;
  performRpc: (method: string, payload?: any, destinationIdentity?: string) => Promise<any>;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

export function LiveKitProvider({ children }: { children: ReactNode }) {
  // Initialize Room as null and only create it when in browser environment
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [rpcHandlers, setRpcHandlers] = useState<Map<string, (data: any) => Promise<any>>>(new Map());

  // Initialize Room only on client side
  useEffect(() => {
    if (isBrowser) {
      console.log('LiveKit: Initializing room on client side');
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        // Add options to improve compatibility
        audioCaptureDefaults: {
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
          // Start with lower quality for better compatibility
          channelCount: 1
        },
        // If media devices aren't available, don't immediately error
        stopLocalTrackOnUnpublish: true
      });
      setRoom(newRoom);
    }
  }, []);

  // Monitor room connection state
  useEffect(() => {
    if (!room) return;

    const handleConnectionStateChanged = (state: ConnectionState) => {
      console.log(`LiveKit connection state: ${state}`);
      setConnectionState(state);
      
      if (state === ConnectionState.Connected) {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('LiveKit: Connected successfully');
      } else if (state === ConnectionState.Connecting) {
        setIsConnecting(true);
        console.log('LiveKit: Connecting...');
      } else {
        setIsConnected(false);
        setIsConnecting(false);
        if (state === ConnectionState.Disconnected) {
          console.log('LiveKit: Disconnected');
        } else if (state === ConnectionState.Reconnecting) {
          console.log('LiveKit: Reconnecting...');
        }
      }
    };

    const handleDisconnected = () => {
      console.log('LiveKit: Room disconnected');
      setIsConnected(false);
      setIsMicrophoneEnabled(false);
      setAudioLevel(0);
      setRemoteParticipants([]);
    };

    const handleError = (err: Error) => {
      console.error('LiveKit room error:', err);
      setError(err);
    };

    const handleParticipantConnected = (participant: RemoteParticipant) => {
      console.log(`LiveKit: Remote participant connected: ${participant.identity}`, participant);
      setRemoteParticipants(prev => [...prev, participant]);
      
      // Listen for participant events
      participant.on(ParticipantEvent.TrackPublished, (publication: TrackPublication) => {
        console.log(`LiveKit: Track published by ${participant.identity}:`, publication);
        if (publication.kind === Track.Kind.Audio) {
          console.log(`LiveKit: Audio track published by ${participant.identity}`);
        }
      });
      
      participant.on(ParticipantEvent.TrackSubscribed, (track: RemoteTrack, publication: TrackPublication) => {
        console.log(`LiveKit: Track subscribed from ${participant.identity}:`, track, publication);
        if (track.kind === Track.Kind.Audio) {
          console.log(`LiveKit: Audio track subscribed from ${participant.identity}, track ID: ${track.sid}`);
        }
      });
      
      participant.on(ParticipantEvent.TrackUnsubscribed, (track: RemoteTrack, publication: TrackPublication) => {
        console.log(`LiveKit: Track unsubscribed from ${participant.identity}:`, publication);
      });
      
      participant.on(ParticipantEvent.TrackMuted, (publication: TrackPublication) => {
        console.log(`LiveKit: Track muted by ${participant.identity}:`, publication);
      });
      
      participant.on(ParticipantEvent.TrackUnmuted, (publication: TrackPublication) => {
        console.log(`LiveKit: Track unmuted by ${participant.identity}:`, publication);
      });
    };
    
    const handleParticipantDisconnected = (participant: RemoteParticipant) => {
      console.log(`LiveKit: Remote participant disconnected: ${participant.identity}`);
      setRemoteParticipants(prev => prev.filter(p => p.sid !== participant.sid));
    };
    
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.MediaDevicesError, handleError);
    room.on(RoomEvent.SignalConnected, () => console.log('LiveKit: Signal connected'));
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    room.on(RoomEvent.Reconnected, () => console.log('LiveKit: Reconnected after temporary disconnect'));
    room.on(RoomEvent.Reconnecting, () => console.log('LiveKit: Attempting to reconnect...'));
    room.on(RoomEvent.LocalTrackPublished, (publication) => {
      console.log(`LiveKit: Local track published:`, publication);
    });
    room.on(RoomEvent.LocalTrackUnpublished, (publication) => {
      console.log(`LiveKit: Local track unpublished:`, publication);
    });
    
    return () => {
      console.log('LiveKit: Cleaning up event listeners');
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.MediaDevicesError, handleError);
      room.off(RoomEvent.SignalConnected, () => {});
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      room.off(RoomEvent.Reconnected, () => {});
      room.off(RoomEvent.Reconnecting, () => {});
      room.off(RoomEvent.LocalTrackPublished, () => {});
      room.off(RoomEvent.LocalTrackUnpublished, () => {});
    };
  }, [room]);

  // Monitor audio level
  useEffect(() => {
    if (!isBrowser || !room || !isConnected || !isMicrophoneEnabled) {
      setAudioLevel(0);
      return;
    }

    // Set up audio level monitoring
    const intervalId = setInterval(() => {
      const localParticipant = room.localParticipant;
      
      // Get all track publications and find the microphone one
      const trackPublications = localParticipant.trackPublications;
      const microphonePublication = Array.from(trackPublications.values())
        .find(pub => pub.source === Track.Source.Microphone);
      
      if (microphonePublication && microphonePublication.track) {
        const audioTrack = microphonePublication.track;
        // Log real audio level if available (some browsers support this)
        if ('audioLevel' in audioTrack) {
          setAudioLevel(audioTrack.audioLevel as number);
        } else {
          // Use a simulated audio level for UI feedback
          // Random value between 0 and 0.5
          const level = Math.random() * 0.5;
          setAudioLevel(level);
        }
      } else {
        setAudioLevel(0);
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [room, isConnected, isMicrophoneEnabled]);

  // Connect to LiveKit room
  const connect = useCallback(async (roomName: string, identity?: string, agentId?: string) => {
    if (!isBrowser || !room || isConnected || isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // Use provided agent ID or fallback to the specified default
      const effectiveAgentId = agentId || "aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d";
      // Use provided identity or fallback to the specified default
      const effectiveUserId = identity || "Xe9nkrHVetU1lHiK8wt7Ujf6SrH3";
      
      console.log(`LiveKit: Initiating connection to chat with agent ${effectiveAgentId}`);
      console.log(`LiveKit: Using user ID: ${effectiveUserId}`);
      
      // API authentication - should be configured properly in production
      const apiKey = process.env.NEXT_PUBLIC_TRICIA_API_KEY || '';
      
      // Get token from HeyTricia API
      const response = await fetch('https://api.heytricia.ai/api/v1/chats', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer admin', // Use the provided static auth token
        },
        body: JSON.stringify({ 
          agent_id: effectiveAgentId,
          user_id: effectiveUserId,
          metadata: {
            title: "Voice conversation",
            client_timestamp: new Date().toISOString(),
          },
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to create chat: ${response.statusText}`;
        
        try {
          // Try to parse error as JSON for better error messages
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            errorMessage += ` - ${typeof errorJson.detail === 'string' ? 
              errorJson.detail : 
              JSON.stringify(errorJson.detail)}`;
          }
        } catch (e) {
          // If not JSON, use raw text
          errorMessage += `. ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      
      // Destructure the response with more robust fallbacks
      const { 
        participant_token: token = null, 
        server_url: serverUrl = null, 
        room_name: actualRoomName = null,
        id: chatId = null
      } = responseData;
      
      if (!token || !serverUrl) {
        console.error('Invalid API response:', responseData);
        throw new Error('Invalid API response: missing required fields');
      }
      
      console.log(`LiveKit: Got token for chat ${chatId}, connecting to server: ${serverUrl}`);
      
      // Connect to LiveKit room
      await room.connect(serverUrl, token, {
        autoSubscribe: true,
      });
      
      console.log('LiveKit: Connected to room:', actualRoomName || roomName);
      console.log('LiveKit: Local participant:', room.localParticipant);
      console.log('LiveKit: Remote participants:', room.remoteParticipants);
      
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
  }, [room, isConnected, isConnecting]);
  
  // Disconnect from LiveKit room
  const disconnect = useCallback(() => {
    if (room) {
      room.disconnect();
      setIsConnected(false);
      setIsMicrophoneEnabled(false);
    }
  }, [room]);

  // Toggle microphone state
  const toggleMicrophone = useCallback(async (): Promise<boolean> => {
    if (!isBrowser || !room || !isConnected) return false;
    
    try {
      const enabled = !isMicrophoneEnabled;
      console.log(`LiveKit: Toggling microphone to ${enabled ? 'enabled' : 'disabled'}`);
      
      // Request microphone permissions if needed and we're in a browser
      if (enabled) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            console.log('LiveKit: Requesting microphone permissions');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('LiveKit: Got microphone permissions', stream);
          } catch (mediaErr) {
            console.warn('LiveKit: Media access error:', mediaErr);
            // Don't throw here - try to continue with LiveKit's API
          }
        } else {
          console.warn('Browser media devices API not available, trying to continue');
          // Don't throw, try to continue with LiveKit's API which might handle this differently
        }
      }
      
      // Attempt to use LiveKit's API which has its own fallbacks
      await room.localParticipant.setMicrophoneEnabled(enabled);
      console.log(`LiveKit: Microphone ${enabled ? 'enabled' : 'disabled'} successfully`);
      
      // Log current tracks
      const tracks = Array.from(room.localParticipant.trackPublications.values());
      console.log('LiveKit: Current local tracks:', tracks);
      
      setIsMicrophoneEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error('LiveKit: Failed to toggle microphone:', err);
      setError(err instanceof Error ? err : new Error('Microphone access failed'));
      return isMicrophoneEnabled;
    }
  }, [room, isConnected, isMicrophoneEnabled]);

  // Register an RPC method that can be called by remote participants
  const registerRpcMethod = useCallback((method: string, handler: (data: any) => Promise<any>) => {
    if (!room || !room.localParticipant) {
      console.error('LiveKit: Cannot register RPC method - not connected');
      return;
    }

    console.log(`LiveKit: Registering RPC method: ${method}`);
    
    // Store the handler locally for tracking
    setRpcHandlers(prev => new Map(prev).set(method, handler));
    
    // Register with LiveKit
    room.localParticipant.registerRpcMethod(method, async (data) => {
      console.log(`LiveKit: RPC method '${method}' called with data:`, data);
      try {
        const result = await handler(data);
        console.log(`LiveKit: RPC method '${method}' completed with result:`, result);
        return result;
      } catch (err) {
        console.error(`LiveKit: RPC method '${method}' failed:`, err);
        throw err;
      }
    });
  }, [room]);

  // Perform an RPC call to a remote participant
  const performRpc = useCallback(async (method: string, payload?: any, destinationIdentity?: string): Promise<any> => {
    if (!room || !room.localParticipant) {
      throw new Error('Cannot perform RPC - not connected');
    }

    // If no destination specified, try to find an agent participant
    let targetIdentity = destinationIdentity;
    if (!targetIdentity) {
      // Find the first remote participant (usually the agent)
      const remoteParticipants = Array.from(room.remoteParticipants.values());
      if (remoteParticipants.length > 0) {
        targetIdentity = remoteParticipants[0].identity;
        console.log(`LiveKit: Auto-selecting RPC target: ${targetIdentity}`);
      } else {
        throw new Error('No remote participants available for RPC');
      }
    }

    console.log(`LiveKit: Performing RPC '${method}' to ${targetIdentity} with payload:`, payload);
    
    try {
      const response = await room.localParticipant.performRpc({
        destinationIdentity: targetIdentity,
        method,
        payload: JSON.stringify(payload || {}),
        responseTimeout: 30000, // 30 second timeout
      });
      
      console.log(`LiveKit: RPC '${method}' response:`, response);
      
      // Try to parse response as JSON, fallback to raw response
      try {
        return JSON.parse(response);
      } catch {
        return response;
      }
    } catch (err) {
      console.error(`LiveKit: RPC '${method}' failed:`, err);
      throw err;
    }
  }, [room]);

  // Clean up RPC methods on disconnect
  useEffect(() => {
    if (!isConnected) {
      // Clear registered handlers when disconnected
      setRpcHandlers(new Map());
    }
  }, [isConnected]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
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
      connectionState,
      registerRpcMethod,
      performRpc
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