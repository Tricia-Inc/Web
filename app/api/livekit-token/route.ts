import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

// Helper function to validate environment variables
function validateEnvVars() {
  const requiredVars = [
    'NEXT_PUBLIC_LIVEKIT_URL',
    'LIVEKIT_API_KEY',
    'LIVEKIT_API_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const { roomName, identity, metadata } = await request.json();
    
    // Validate required parameters
    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    // Validate environment variables
    if (!validateEnvVars()) {
      console.warn('LiveKit environment variables not set properly. Check your .env.local file.');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Use the LiveKit server SDK to generate a real token
    const apiKey = process.env.LIVEKIT_API_KEY as string;
    const apiSecret = process.env.LIVEKIT_API_SECRET as string;
    const userIdentity = identity || `user-${Date.now()}`;
    
    // Create token with appropriate permissions
    const token = new AccessToken(apiKey, apiSecret, {
      identity: userIdentity,
      name: metadata?.name || userIdentity,
    });
    
    // Grant appropriate permissions
    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });
    
    return NextResponse.json({
      token: token.toJwt(),
      serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 