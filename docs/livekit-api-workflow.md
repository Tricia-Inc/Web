# LiveKit API Connection Workflow

## Overview

This document explains the complete workflow for establishing LiveKit room connections between the web client and backend agent.

## 1. API Endpoint

**URL**: `https://api.heytricia.ai/api/v1/chats`  
**Method**: `POST`  
**Authentication**: `Bearer admin` (static token for now)

## 2. Client-Side Connection Flow

### Step 1: Client Initiates Connection

When user enters the chat page, the client calls:

```typescript
connect(chatRoomId, userId, agentId)
```

### Step 2: API Request

The client sends a POST request to create a chat:

```typescript
POST https://api.heytricia.ai/api/v1/chats
Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer admin

Body:
{
  "agent_id": "aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d",
  "user_id": "Xe9nkrHVetU1lHiK8wt7Ujf6SrH3",
  "metadata": {
    "title": "Voice conversation",
    "client_timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Step 3: API Response

The API creates a LiveKit room and returns:

```json
{
  "id": "chat-123",                                    // Chat ID
  "participant_name": "user-456",                      // LiveKit participant name
  "participant_token": "eyJhbGciOiJIUzI1NiJ9...",     // JWT token for LiveKit
  "room_name": "cc7afcf9-07c5-4416-8bb8-3582eb94a436", // LiveKit room name
  "server_url": "wss://tricia-fv0gb763.livekit.cloud"  // LiveKit server URL
}
```

### Step 4: Client Connects to LiveKit

Using the response data:

```typescript
await room.connect(serverUrl, token, {
  autoSubscribe: true,
});
```

## 3. Backend Agent Connection Flow

### Step 1: Agent Worker Receives Job

The backend agent receives a job with metadata:

```python
{
  "job_id": "AJ_4VtxhUzMmvcd",
  "room_name": "cc7afcf9-07c5-4416-8bb8-3582eb94a436",
  "agent_name": "tricia-agent",
  "metadata": {
    "user_id": "Xe9nkrHVetU1lHiK8wt7Ujf6SrH3",
    "agent_id": "aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d",
    "journal_id": "optional-existing-journal-id"
  }
}
```

### Step 2: Agent Connects to Room

The agent connects using the provided room name:

```python
await ctx.connect()  # Connects to room specified in job
```

### Step 3: Agent Initializes

- Loads appropriate agent configuration (Tricia)
- Creates journal data structure
- Registers RPC methods
- Starts voice session

## 4. Complete Sequence Diagram

```
User           Client App         API Server        LiveKit         Agent Worker
 |                 |                  |                |                 |
 |--Enter Chat---->|                  |                |                 |
 |                 |                  |                |                 |
 |                 |--POST /chats---->|                |                 |
 |                 |  (user_id,       |                |                 |
 |                 |   agent_id)      |                |                 |
 |                 |                  |                |                 |
 |                 |                  |--Create Room-->|                 |
 |                 |                  |                |                 |
 |                 |                  |<--Room Info----|                 |
 |                 |                  |                |                 |
 |                 |                  |--Dispatch Job----------------->|
 |                 |                  |                |                 |
 |                 |<--Token/URL------|                |                 |
 |                 |                  |                |                 |
 |                 |--Connect---------|--------------->|                 |
 |                 |                  |                |                 |
 |                 |                  |                |<---Connect------|
 |                 |                  |                |                 |
 |                 |<---------RPC Communication------->|<--------------->|
 |                 |                  |                |                 |
```

## 5. Key Requirements

### For Successful Connection:

1. **Valid User ID**: Must be a registered user in the system
2. **Valid Agent ID**: Must match a configured agent
3. **Authentication**: `Bearer admin` token must be valid
4. **Network**: WebSocket connectivity to LiveKit server

### Environment Variables:

**Client-side:**
- `NEXT_PUBLIC_TRICIA_API_KEY` (not currently used)

**Backend:**
- `LIVEKIT_URL`: LiveKit server URL
- `LIVEKIT_API_KEY`: LiveKit API key
- `LIVEKIT_API_SECRET`: LiveKit API secret
- `API_URL`: Backend API URL
- `API_TOKEN`: Backend API token

## 6. Error Handling

### Common Errors:

1. **401 Unauthorized**: Invalid Bearer token
2. **404 Not Found**: Invalid agent_id
3. **422 Validation Error**: Missing required fields
4. **500 Server Error**: LiveKit room creation failed

### Client Error Handling:

```typescript
if (!response.ok) {
  const errorText = await response.text();
  // Parse and display error
  throw new Error(errorMessage);
}
```

### Backend Error Handling:

- Validates job metadata
- Checks journal permissions
- Falls back to default values when needed

## 7. Room Lifecycle

1. **Creation**: Room created when client calls `/api/v1/chats`
2. **Active**: Both participants connected and can communicate
3. **Cleanup**: Room destroyed when both participants disconnect

## 8. Security Considerations

1. **Authentication**: Currently uses static `Bearer admin` token (should be replaced with proper auth)
2. **User Validation**: User IDs should be validated against database
3. **Agent Access**: Agent IDs should be verified for permissions
4. **Token Expiry**: LiveKit tokens should have appropriate expiration times

## 9. Testing the Flow

### Manual Testing:
1. Open browser console
2. Navigate to `/chatpage`
3. Watch for console logs starting with "LiveKit:"
4. Verify connection states and RPC messages

### Debugging:
- Check browser console for client-side errors
- Check agent worker logs for backend errors
- Verify network tab shows successful API calls
- Ensure WebSocket connection established to LiveKit 