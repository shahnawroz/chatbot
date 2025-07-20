import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error: Failed to get response" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 shadow-md z-20 p-5 text-center">
        <h1 className="text-3xl font-extrabold tracking-wide">MIANS AI Chatbot</h1>
        <p className="text-sm text-gray-400 mt-1">Powered by MIANS</p>
      </header>

      {/* Chat Window */}
      <main
        className="flex flex-col flex-grow overflow-y-auto max-w-3xl mx-auto w-full px-6 py-6 pt-28 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 && !loading && (
          <p className="text-center text-gray-500 italic select-none mt-20">
            Say hi to start chatting with AI 🤖
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-lg break-words
              ${
                msg.sender === "user"
                  ? "self-end bg-white text-black rounded-br-none ml-auto"
                  : "self-start bg-gray-900 text-white rounded-bl-none border border-gray-700 mr-auto"
              }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}

        {loading && (
          <div className="self-start max-w-[70%] px-5 py-3 rounded-2xl bg-gray-900 text-gray-400 animate-pulse border border-gray-700 mr-auto">
            Thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Input Box */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 shadow-inner p-4 max-w-3xl mx-auto w-full flex gap-4 items-center px-6 z-20">
        <textarea
          rows={1}
          maxLength={1000}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow resize-none bg-gray-900 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Send message"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
