import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    return NextResponse.json({ response: response.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Gemini' },
      { status: 500 }
    );
  }
}
