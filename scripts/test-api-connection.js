#!/usr/bin/env node

/**
 * Test script for verifying the LiveKit API connection workflow
 * 
 * Usage: node scripts/test-api-connection.js
 */

const API_URL = 'https://api.heytricia.ai/api/v1/chats';
const AUTH_TOKEN = 'Bearer admin';
const AGENT_ID = 'aa0b0d4e-bc28-4e4e-88c1-40b829b6fb9d';
const USER_ID = 'Xe9nkrHVetU1lHiK8wt7Ujf6SrH3';

async function testAPIConnection() {
  console.log('🧪 Testing LiveKit API Connection...\n');
  
  console.log('📡 API Endpoint:', API_URL);
  console.log('🤖 Agent ID:', AGENT_ID);
  console.log('👤 User ID:', USER_ID);
  console.log('🔑 Auth Token:', AUTH_TOKEN);
  console.log('\n-----------------------------------\n');
  
  try {
    console.log('📤 Sending POST request to create chat...');
    
    const requestBody = {
      agent_id: AGENT_ID,
      user_id: USER_ID,
      metadata: {
        title: "Voice conversation",
        client_timestamp: new Date().toISOString(),
      }
    };
    
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': AUTH_TOKEN
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('\n📥 Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('\n✅ Success! Room created:');
      console.log('-----------------------------------');
      console.log('Chat ID:', data.id);
      console.log('Room Name:', data.room_name);
      console.log('Server URL:', data.server_url);
      console.log('Participant Name:', data.participant_name);
      console.log('Token (truncated):', data.participant_token?.substring(0, 50) + '...');
      
      // Decode JWT token header to see metadata
      if (data.participant_token) {
        try {
          const [header] = data.participant_token.split('.');
          const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString());
          console.log('\nToken Header:', decodedHeader);
        } catch (e) {
          console.log('\nCould not decode token header');
        }
      }
      
      console.log('\n🎉 API connection test successful!');
      console.log('\n📝 Next steps:');
      console.log('1. The agent worker should now connect to room:', data.room_name);
      console.log('2. The client can connect using the token and server URL');
      console.log('3. Both participants can then communicate via RPC');
      
    } else {
      console.log('\n❌ Error Response:');
      console.log(responseText);
      
      // Try to parse error as JSON
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.detail) {
          console.log('\nError Details:', errorData.detail);
        }
      } catch (e) {
        // Not JSON, already printed raw text
      }
    }
    
  } catch (error) {
    console.error('\n🚨 Network Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAPIConnection().catch(console.error); 