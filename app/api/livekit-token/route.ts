import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In a real implementation, you would use the LiveKit server SDK to generate
    // a token. For now, we'll return a mock token for development.
    const { roomName } = await request.json();
    
    if (!roomName) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }
    
    // This is a mock implementation - in production, use proper token generation:
    // import { AccessToken } from 'livekit-server-sdk';
    // const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {...});
    
    const mockToken = `mock-token-for-${roomName}-${Date.now()}`;
    
    return NextResponse.json({
      token: mockToken,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
} 