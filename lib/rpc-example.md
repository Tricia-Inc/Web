# LiveKit RPC Integration Guide

This guide explains how to use Remote Procedure Calls (RPC) with LiveKit in your application.

## What is RPC?

RPC (Remote Procedure Call) allows participants in a LiveKit room to call methods on each other. This is especially useful for:
- Agent interactions (e.g., requesting journal generation)
- Real-time UI updates across participants
- Command and control between client and backend

## Basic Usage

### 1. Registering RPC Methods (Receiving Calls)

Register methods that other participants can call on your client:

```typescript
const { registerRpcMethod } = useLiveKit()

// Register when connected
useEffect(() => {
  if (!isConnected || !registerRpcMethod) return
  
  // Register a method to receive data
  registerRpcMethod('method_name', async (data) => {
    console.log('Received data:', data)
    // Process the data
    // Return a response
    return { success: true, message: 'Processed successfully' }
  })
}, [isConnected, registerRpcMethod])
```

### 2. Performing RPC Calls (Sending Calls)

Call methods on remote participants:

```typescript
const { performRpc } = useLiveKit()

const handleAction = async () => {
  try {
    const response = await performRpc('method_name', {
      // Your payload data
      key: 'value'
    })
    console.log('Response:', response)
  } catch (err) {
    console.error('RPC failed:', err)
  }
}
```

## Current RPC Methods in the App

### Client-Side Methods (Registered in chatpage)

1. **`journal_preview`** - Receives generated journal from agent
   - Payload: `{ journal: { title, date, location, content, images, people, emotion } }`
   - Action: Stores journal in sessionStorage and navigates to preview page

2. **`status_update`** - Receives status messages from agent
   - Payload: `{ message: string, type: 'success' | 'error' }`
   - Action: Shows status message in UI

3. **`agent_action`** - Handles various agent-initiated actions
   - Payload: `{ action: string, ...params }`
   - Actions: navigate, show_camera, hide_camera

### Agent-Side Methods (Called by client)

1. **`generate_journal`** - Requests journal generation
   - Payload: `{ user_id: string, timestamp: string }`
   - Response: `{ success: boolean, error?: string }`

2. **`camera_opened`** - Notifies agent when camera is opened
   - Payload: `{ timestamp: string }`

## Advanced Example: Custom RPC Flow

Here's how to create a custom RPC interaction:

```typescript
// In your component
function MyComponent() {
  const { registerRpcMethod, performRpc, isConnected } = useLiveKit()
  
  useEffect(() => {
    if (!isConnected) return
    
    // Register to receive results
    registerRpcMethod('custom_result', async (data) => {
      const result = JSON.parse(data.payload)
      // Update your UI with the result
      setResult(result)
      return { received: true }
    })
  }, [isConnected])
  
  const requestCustomAction = async () => {
    try {
      // Request action from agent
      await performRpc('custom_action', {
        action: 'analyze',
        data: 'some data'
      })
      // Agent will respond via 'custom_result' RPC
    } catch (err) {
      console.error('Failed:', err)
    }
  }
}
```

## Best Practices

1. **Always check connection status** before performing RPC calls
2. **Handle errors gracefully** - RPC calls can fail for various reasons
3. **Use appropriate timeouts** - Default is 30 seconds in our implementation
4. **Parse payloads safely** - Always validate incoming data
5. **Clean up handlers** when components unmount

## Debugging Tips

- Check console logs for "LiveKit: RPC" messages
- Verify both participants are connected before calling RPC
- Ensure method names match exactly between caller and receiver
- Check that payloads are serializable (JSON.stringify-able) 