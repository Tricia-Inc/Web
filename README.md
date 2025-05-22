# Tricia - Voice-Enabled Chat Application

A modern, real-time voice chat application built with Next.js 14 and LiveKit.

## Features

- Real-time voice communication
- Animated voice visualization
- Responsive mobile-first design
- User profiles and authentication
- Modern UI with smooth animations

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Voice Communication**: LiveKit
- **Authentication**: Next.js built-in auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A LiveKit account (free tier available)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Tricia-Inc/tricia-web.git
   cd tricia-web
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Configure environment variables
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local
   
   # Edit with your credentials
   # Add your LiveKit credentials from dashboard.livekit.io
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Voice Chat Implementation

This project integrates LiveKit for real-time voice communication. See [README-livekit.md](./README-livekit.md) for detailed documentation on the LiveKit integration.

Key components:
- LiveKit context provider (`lib/livekit-context.tsx`)
- Voice visualization orb (`components/voice-orb.tsx`)
- Chat interface (`app/chatpage/page.tsx`)
- Token generation API (`app/api/livekit-token/route.ts`)

## Project Structure

```
/app                 # Next.js 14 app directory
  /api               # API routes including LiveKit token generation
  /chatpage          # Voice chat interface
  /profile           # User profile pages
  /...               # Other app routes
/components          # Reusable React components
  /ui                # UI components (buttons, inputs, etc.)
  /voice-orb.tsx     # Voice visualization component
/lib                 # Utility functions and shared code
  /livekit-context.tsx  # LiveKit integration
/public              # Static assets
/styles              # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Ownership

Copyright (c) May 21, 2025 Tricia, Inc. - Ian Wu

## Acknowledgments

- [LiveKit](https://livekit.io) for their excellent real-time communication SDK
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling 