# Gemini 2.5 Flash Chat Application

A modern chat interface powered by Google's Gemini 2.5 Flash AI model, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 Real-time chat with Gemini 2.5 Flash
- 💬 Beautiful, responsive chat interface
- ⚡ Fast responses with loading indicators
- 🎨 Modern UI with gradients and animations
- 🔒 Secure API key handling

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/apikey)
   - Create a new API key
   - Copy the API key

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Replace `your_actual_api_key_here` with your actual API key:
   ```
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start chatting with Gemini 2.5 Flash!

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/
│       └── chat/
│           └── route.ts   # API endpoint for Gemini
└── components/
    └── ChatInterface.tsx  # Main chat component
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **@google/genai** - Official Google Generative AI SDK
- **Gemini 2.5 Flash** - Google's latest AI model

## API Usage

The chat interface sends POST requests to `/api/chat` with the user's message and receives AI responses. The API is secured with server-side API key handling.

## Security

- API keys are stored securely in environment variables
- Client-side code never exposes the API key
- All AI requests are processed server-side

## Contributing

Feel free to submit issues and pull requests to improve the chat experience!
