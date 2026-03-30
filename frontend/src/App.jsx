import { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🎤 Voice
  const recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "en-US";
  }

  const startListening = () => {
    if (!recognition) return alert("Voice not supported");
    recognition.start();
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  // 🧠 Parse AI response
  const parseResponse = (text) => {
    return {
      confidence: text.split("1. Confidence Feedback:")[1]?.split("2.")[0]?.trim(),
      strengths: text.split("2. Strengths:")[1]?.split("3.")[0]?.trim(),
      weaknesses: text.split("3. Weaknesses:")[1]?.split("4.")[0]?.trim(),
      improved: text.split("4. Improved Answer:")[1]?.split("5.")[0]?.trim(),
      score: text.split("5. Final Score:")[1]?.trim(),
    };
  };

  // 🚀 Send message
  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask?q=${input}`);
      const data = await res.json();

      if (!res.ok) throw new Error();

      const parsed = parseResponse(data.response);

      setMessages((prev) => [...prev, { role: "ai", data: parsed }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Server error. Try again." },
      ]);
    }

    setLoading(false);
  };

  // 🧠 Load memory
  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 💾 Save memory
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  // 🔄 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const newChat = () => {
    setMessages([]);
    localStorage.removeItem("chat");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Sidebar */}
      <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-4 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-6">🤖 AI Agent</h2>

        <button
          onClick={newChat}
          className="w-full p-2 mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
        >
          + New Chat
        </button>

        <div className="text-sm text-gray-400">
          <p className="mb-2">Recent</p>
          <ul className="space-y-2">
            <li>Interview</li>
            <li>Career</li>
          </ul>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="p-4 border-b border-white/10">
          AI Career Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.length === 0 && (
            <div className="text-center mt-32">
              <h2 className="text-4xl font-bold">🚀 Ask anything</h2>
              <p className="text-gray-400">
                Interview feedback, career advice & more
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3 items-start">

              {msg.role === "ai" && <div>🤖</div>}

              {/* USER MESSAGE */}
              {msg.role === "user" && (
                <div className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl max-w-xl">
                  {msg.text}
                </div>
              )}

              {/* AI MESSAGE */}
              {msg.role === "ai" && msg.data && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-xl space-y-2 max-w-xl">

                  <p><b>💬 Confidence:</b> {msg.data.confidence}</p>

                  <p><b>✅ Strengths:</b><br />{msg.data.strengths}</p>

                  <p><b>⚠️ Weaknesses:</b><br />{msg.data.weaknesses}</p>

                  <p><b>✨ Improved Answer:</b><br />{msg.data.improved}</p>

                  <p className="text-green-400 font-bold">
                    🎯 Score: {msg.data.score}
                  </p>

                </div>
              )}

              {/* ERROR MESSAGE */}
              {msg.role === "ai" && msg.text && (
                <div className="bg-red-500/20 p-3 rounded-xl">
                  {msg.text}
                </div>
              )}

            </div>
          ))}

          {loading && <p className="text-gray-400">🤖 Thinking...</p>}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 flex justify-center">
          <div className="flex w-full max-w-3xl bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-2">

            <button
              onClick={startListening}
              className="px-3 text-xl hover:scale-110 transition"
            >
              🎤
            </button>

            <input
              className="flex-1 bg-transparent outline-none px-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition"
            >
              Send
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
