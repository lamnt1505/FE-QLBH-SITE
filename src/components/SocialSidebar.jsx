import React, { useState } from "react";

const ChatWindow = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const sender = localStorage.getItem("accountName") || "Khách";

      const res = await fetch(
        "http://localhost:8080/api/chat/send?sender=" +
          sender +
          "&content=" +
          encodeURIComponent(message),
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          { sender, content: message, timestamp: Date.now() },
        ]);
        setMessage("");
        alert("✅ Đã gửi tới admin");
      } else {
        alert("❌ Gửi tin nhắn thất bại");
      }
    } catch (err) {
      console.error("Lỗi gửi chat:", err);
      alert("⚠️ Lỗi kết nối server");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat với nhân viên</h3>
        <button onClick={onClose} className="chat-close-btn">
          &times;
        </button>
      </div>
      <div className="chat-body">
        {messages.length === 0 ? (
          <p className="text-muted">👉 Hãy bắt đầu nhắn tin...</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`chat-message ${
                m.sender === (localStorage.getItem("accountName") || "Khách")
                  ? "me"
                  : "admin"
              }`}
            >
              <strong>{m.sender}: </strong>
              <span>{m.content}</span>
            </div>
          ))
        )}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <button onClick={handleSend} disabled={sending}>
          Gửi
        </button>
      </div>
    </div>
  );
};

const SocialSidebar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className="social-sidebar">
        <div className="social-icon">f</div>
        <div className="social-icon">i</div>
        <div className="social-icon">y</div>
        <div className="social-icon">z</div>
      </div>
      <div className="chat-bubble-container">
        <div className="chat-bubble-label">Nhắn tới nhân viên</div>
        <div className="chat-bubble" onClick={toggleChatWindow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-message-square"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
      {isChatOpen && <ChatWindow onClose={toggleChatWindow} />}
    </>
  );
};

export default SocialSidebar;
