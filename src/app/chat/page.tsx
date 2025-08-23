import ChatInterface from "@/components/ChatInterface";

export default function ChatPage() {
    return (
        <div className="absolute inset-0 z-0"
            style={{
                backgroundImage: `
                radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
            }}
        >
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Gemini 2.5 Flash Chat
                </h1>
                <p className="text-gray-600">
                    Powered by Google's latest AI technology
                </p>
            </div>
            <ChatInterface />
        </div>
    )
}