import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

// Store chat sessions in memory (in production, use a database or Redis)
const chatSessions = new Map();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, messages } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create chat session
    let chat = chatSessions.get(sessionId);
    
    if (!chat) {
      chat = await genAI.chats.create({
        model: 'gemini-2.5-flash',
      });
      chatSessions.set(sessionId, chat);
      
      // If there are previous messages, send them to establish context
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          if (msg.role === 'user') {
            await chat.sendMessage({ message: msg.content });
          }
        }
      }
    }

    // Send the current message
    const response = await chat.sendMessage({ message });

    return NextResponse.json({
      response: response.text,
      sessionId
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (sessionId) {
      chatSessions.delete(sessionId);
    } else {
      // Clear all sessions if no specific sessionId provided
      chatSessions.clear();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing chat session:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}
