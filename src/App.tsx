import { useState, useRef, useEffect } from "react";
import "./App.css";

type Message = {
  role: "user" | "ai";
  text: string;
};

function App() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    setChat((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("https://insult-me-bea.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "ai", text: data.response }
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Error: Unable to fetch response" }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="app">
      <div className="chat-header">AI Chat</div>

      <div className="chat-container">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`message ${c.role === "user" ? "user" : "ai"}`}
          >
            {c.text}
          </div>
        ))}

        {loading && <div className="message ai">Typing...</div>}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;