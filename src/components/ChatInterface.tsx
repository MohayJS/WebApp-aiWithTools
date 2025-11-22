'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/lib/auth';
import ReactMarkdown from 'react-markdown';
import { Trash2, Send, Sparkles, Bot, User as UserIcon, ArrowUp } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  user?: User | null;
}

const SUGGESTED_PROMPTS = [
  "What courses are available?",
  "How do I enroll in CS101?",
  "Show me my current schedule",
  "What are the prerequisites for MATH101?"
];

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as any);
    }
  };

  const sendMessage = async (e: React.FormEvent, customContent?: string) => {
    e.preventDefault();
    const contentToSend = customContent || input.trim();
    if (!contentToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: contentToSend,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customContent) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contentToSend,
          sessionId,
          messages: messages,
          user: user,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }

    setMessages([]);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-medium text-gray-500">Online</p>
            </div>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 rounded-full" />
              <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-white to-indigo-50 border border-white/60 shadow-xl flex items-center justify-center mb-6 mx-auto transform hover:scale-105 transition-transform duration-500">
                <Sparkles className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
            
            <div className="max-w-md space-y-2">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                How can I help you?
              </h1>
              <p className="text-gray-500">
                Ask me about courses, enrollment, schedules, or anything else related to your studies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={(e) => sendMessage(e, prompt)}
                  className="p-4 text-left rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`w-full ${message.role === 'assistant' ? 'bg-transparent' : ''}`}
              >
                <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4 md:gap-6">
                  {/* Avatar */}
                  <div className={`
                    flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm mt-1
                    ${message.role === 'user' 
                      ? 'bg-indigo-100 text-indigo-600 order-2' 
                      : 'bg-white text-indigo-600 border border-indigo-100 order-1'
                    }
                  `}>
                    {message.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 space-y-2 overflow-hidden ${message.role === 'user' ? 'order-1 text-right' : 'order-2'}`}>
                    <div className={`
                      text-sm leading-relaxed
                      ${message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-none inline-block text-left shadow-sm'
                        : 'text-gray-800'
                      }
                    `}>
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-gray-800 prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === 'assistant' && (
                       <div className="flex items-center gap-2">
                         <p className="text-[10px] text-gray-400">
                           {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="w-full">
                <div className="max-w-3xl mx-auto px-4 py-6 flex gap-4 md:gap-6">
                  <div className="h-8 w-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center shadow-sm mt-1">
                    <Bot className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex items-center space-x-1.5 mt-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 z-10 bg-gradient-to-t from-[#f8f9fc] via-[#f8f9fc] to-transparent">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={sendMessage} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2rem] opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 -m-[1px] pointer-events-none" />
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full bg-white border-0 rounded-[2rem] pl-6 pr-14 py-4 shadow-lg shadow-indigo-500/5 focus:ring-0 text-gray-700 placeholder-gray-400 resize-none min-h-[60px] max-h-[200px]"
                disabled={isLoading}
                rows={1}
                style={{
                  height: 'auto',
                  overflowY: input.split('\n').length > 5 ? 'auto' : 'hidden'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                }}
              />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2.5 bottom-4 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-2">
            AI can make mistakes. Please verify important enrollment information.
          </p>
        </div>
      </div>
    </div>
  );
}
