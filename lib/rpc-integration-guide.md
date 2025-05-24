# LiveKit RPC Integration Guide - Complete Reference

## Overview

This guide documents the complete RPC integration between the web client and the backend agent for the Tricia journal application.

## Architecture

```
Web Client (Next.js)                    Backend Agent (Python)
    |                                           |
    |------ user.generate_journal ------>      |
    |                                           |
    |<----- agent.journal_generated ------     |
    |                                           |
    |------ user.save_journal ---------->      |
    |                                           |
    |<----- agent.journal_saved ---------      |
```

## Backend RPC Methods (Client → Backend)

### 1. `user.generate_journal`

**Purpose**: Requests the agent to generate a journal from the conversation history.

**Client Call**:
```typescript
const response = await performRpc('user.generate_journal', {
  user_id: userId,
  timestamp: new Date().toISOString()
})
```

**Backend Handler**:
- Generates journal content using conversation history
- Sends journal data back via `agent.journal_generated` RPC
- Returns the journal data in response

**Response**:
```json
{
  "id": "journal-uuid",
  "title": "Journal Title",
  "narrative": "Full story content...",
  "date": "Date string",
  "people": ["Person 1", "Person 2"],
  "emotion": "emotional tag",
  "images": ["image-url-1", "image-url-2"],
  "thumbnail_url": "primary-image-url"
}
```

### 2. `user.save_journal`

**Purpose**: Saves the generated journal to permanent storage.

**Client Call**:
```typescript
const response = await performRpc('user.save_journal', {
  timestamp: new Date().toISOString()
})
```

**Backend Handler**:
- Saves journal to backend API
- Sends confirmation via `agent.journal_saved` RPC
- Resets journal state for next entry

**Response**: Returns the saved journal data with timestamps.

### 3. `user.add_image`

**Purpose**: Adds an image to the current journal.

**Client Call**:
```typescript
const response = await performRpc('user.add_image', {
  image_url: imageUrl
})
```

**Backend Handler**:
- Adds image to journal's image collection
- Interrupts current speech if agent is speaking
- Generates description of the image

**Response**:
```json
{
  "status": "success",
  "image_url": "added-image-url",
  "image_urls": ["all", "journal", "images"]
}
```

### 4. `user.remove_image`

**Purpose**: Removes an image from the journal.

**Client Call**:
```typescript
const response = await performRpc('user.remove_image', {
  image_url: imageUrl
})
```

**Response**:
```json
{
  "status": "success",
  "message": "Image removed from journal",
  "image_urls": ["remaining", "images"]
}
```

### 5. `user.select_image`

**Purpose**: Sets the current focus image for discussion.

**Client Call**:
```typescript
const response = await performRpc('user.select_image', {
  image_url: imageUrl
})
```

**Response**:
```json
{
  "status": "success",
  "current_image": "selected-image-url",
  "image_urls": ["all", "images"]
}
```

## Backend RPC Methods (Backend → Client)

### 1. `agent.journal_generated`

**Purpose**: Sends generated journal data to client for preview.

**Backend Sends**:
```python
await room.local_participant.perform_rpc(
    destination_identity=participant_identity,
    method="agent.journal_generated",
    payload=json.dumps(journal_data)
)
```

**Client Handler**:
```typescript
registerRpcMethod('agent.journal_generated', async (data) => {
  const parsedData = JSON.parse(data.payload)
  sessionStorage.setItem('journalPreview', JSON.stringify(parsedData))
  router.push("/journal-preview")
  return JSON.stringify({ status: "success" })
})
```

### 2. `agent.journal_saved`

**Purpose**: Notifies client that journal was successfully saved.

**Backend Sends**:
```python
await room.local_participant.perform_rpc(
    destination_identity=participant_identity,
    method="agent.journal_saved",
    payload=json.dumps(saved_journal_data)
)
```

**Client Handler**:
```typescript
registerRpcMethod('agent.journal_saved', async (data) => {
  setStatusMessage({
    text: "Journal saved successfully!",
    type: 'success'
  })
  return JSON.stringify({ status: "success" })
})
```

## Complete Flow Example

### Journal Generation Flow:

1. **User clicks journal button** → triggers `handleJournalClick()`
2. **Client calls** `user.generate_journal` RPC
3. **Backend processes** conversation history, generates journal
4. **Backend sends** `agent.journal_generated` RPC with journal data
5. **Client receives** journal data, stores in sessionStorage
6. **Client navigates** to journal preview page
7. **Preview page loads** journal from sessionStorage

### Journal Save Flow:

1. **User clicks save on preview page**
2. **Client calls** `user.save_journal` RPC
3. **Backend saves** to API database
4. **Backend sends** `agent.journal_saved` RPC confirmation
5. **Client shows** success message
6. **Client navigates** back to chat page

## Error Handling

All RPC methods should handle errors gracefully:

```typescript
try {
  const response = await performRpc('method_name', payload)
  if (response?.error) {
    throw new Error(response.error)
  }
  // Handle success
} catch (err) {
  console.error('RPC error:', err)
  setStatusMessage({
    text: err.message,
    type: 'error'
  })
}
```

## Important Notes

1. **Connection Required**: All RPC calls require an active LiveKit connection
2. **JSON Serialization**: All payloads must be JSON-serializable
3. **Response Format**: Backend sends JSON strings, client must parse them
4. **Error Responses**: Always check for `error` field in responses
5. **Async Operations**: All RPC calls are asynchronous 