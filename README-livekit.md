# LiveKit Integration for Chat Application

This document explains how LiveKit has been integrated into the chat application for voice communication.

## Overview

LiveKit provides real-time voice and video capabilities to the application. The current implementation focuses on voice functionality, with the microphone button toggling audio transmission and the voice orb visualizing audio levels.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install livekit-client @livekit/components-react
   ```

2. **Create a LiveKit account**:
   - Sign up at [LiveKit.io](https://livekit.io)
   - Create a new project
   - Get your API key and secret

3. **Configure environment variables**:
   - Create a `.env.local` file in the project root with:
   ```
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-project.livekit.cloud
   LIVEKIT_API_KEY=your_api_key_here
   LIVEKIT_API_SECRET=your_api_secret_here
   ```

4. **Run setup script** (optional):
   ```bash
   node scripts/setup-livekit.js
   ```

5. **For production**:
   - Install the LiveKit server SDK: `npm install livekit-server-sdk`
   - Update the token generation in `app/api/livekit-token/route.ts` with proper authentication

## Implementation Details

### Key Components

1. **LiveKit Context Provider** (`lib/livekit-context.tsx`):
   - Manages room connection
   - Provides microphone controls
   - Tracks audio levels

2. **Voice Orb** (`components/voice-orb.tsx`):
   - Visualizes audio input using LiveKit audio levels
   - Animates based on voice activity

3. **Chat Page** (`app/chatpage/page.tsx`):
   - Uses LiveKit for microphone functionality
   - Connects to a default room on load

4. **Token Generation** (`app/api/livekit-token/route.ts`):
   - Generates authentication tokens for LiveKit
   - Currently uses a mock implementation for development

## Testing

To test the LiveKit implementation:

1. Start the development server: `npm run dev`
2. Open the chat page
3. Click the microphone button to toggle audio
4. Speak into your microphone and observe the voice orb animation

## Troubleshooting

- If the microphone doesn't work, check browser permissions
- If connection fails, verify your LiveKit credentials
- For deployment issues, ensure your environment variables are properly set

## Further Enhancements

Potential next steps for the LiveKit integration:

1. Add video chat capability
2. Implement multi-user rooms
3. Add screen sharing functionality
4. Implement chat messaging
5. Add recording functionality 