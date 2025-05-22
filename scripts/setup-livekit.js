/**
 * LiveKit Setup Script
 * 
 * This script guides users through setting up LiveKit in their environment.
 * Run with: node scripts/setup-livekit.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== LiveKit Setup Guide ===\n');
console.log('This script will help you set up LiveKit for your chat application.\n');

console.log('Step 1: Create a LiveKit account at https://livekit.io\n');
console.log('Step 2: Create a new project and get your API keys\n');
console.log('Step 3: Configure your environment variables\n');

rl.question('Do you want to create a .env.local file with LiveKit configuration? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    const envContent = `# LiveKit Configuration
# Replace these with your actual LiveKit credentials from your LiveKit dashboard
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here`;

    try {
      fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
      console.log('\n✅ .env.local file created successfully!');
      console.log('   Please edit this file and add your actual LiveKit credentials.');
    } catch (error) {
      console.error('\n❌ Failed to create .env.local file:', error.message);
      console.log('   Please create it manually with these contents:');
      console.log('\n-----------------------------------');
      console.log(envContent);
      console.log('-----------------------------------');
    }
  }

  console.log('\nStep 4: Install LiveKit Server SDK for token generation');
  console.log('   Run: npm install livekit-server-sdk');
  
  console.log('\nStep 5: Update the token generation API with your actual credentials');
  console.log('   Edit: app/api/livekit-token/route.ts');
  
  console.log('\nFor more information, visit https://docs.livekit.io\n');
  
  rl.close();
}); 