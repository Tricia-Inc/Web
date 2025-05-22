import { NextResponse } from 'next/server';

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

    // For development mode, use a mock token
    if (process.env.NODE_ENV === 'development' && !process.env.LIVEKIT_API_KEY) {
      console.warn('Using mock LiveKit token in development. For production, set LIVEKIT_API_KEY and LIVEKIT_API_SECRET.');
      return NextResponse.json({
        token: `mock-token-for-${roomName}-${Date.now()}`,
        serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://example.livekit.cloud',
      });
    }
    
    // Validate environment variables for production
    if (!validateEnvVars()) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // For production, use the LiveKit server SDK to generate a real token
    // This code should be uncommented and properly configured for production
    /*
    import { AccessToken } from 'livekit-server-sdk';
    
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
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
    */
    
    // Return a mock token for now - REPLACE THIS WITH ACTUAL TOKEN GENERATION
    return NextResponse.json({
      token: `mock-token-for-${roomName}-${Date.now()}`,
      serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://example.livekit.cloud',
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
} 