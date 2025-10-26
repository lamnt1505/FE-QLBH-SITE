import React, { useState, useEffect } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../FirebaseConfig/firebaseConfig";
import "../styles/ChatBox/ChatBox.css";
const ChatWindow = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const sender = localStorage.getItem("accountName") || "Khách";

useEffect(() => {
  const chatRef = ref(db, "chat/conversations");
  const unsubscribe = onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.values(data)
        .filter(
          (m) =>
            m.sender === sender ||
            m.content?.startsWith(`(${sender})`)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(list);
    } else {
      setMessages([]);
    }
  });
  return () => unsubscribe();
}, [sender]);

useEffect(() => {
  const chatBody = document.querySelector(".chat-body");
  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }
}, [messages]);


const handleSend = async () => {
  if (!message.trim()) return;
  setSending(true);

  try {
    const chatRef = ref(db, "chat/conversations");
    const newMsgRef = push(chatRef);
    await set(newMsgRef, {
      sender,
      content: message,
      timestamp: Date.now(),
    });
    setMessage("");
  } catch (err) {
    console.error("Lỗi gửi chat:", err);
    alert("⚠️ Lỗi khi gửi tin nhắn");
  } finally {
    setSending(false);
  }
};

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>CHAT VỚI NHÂN VIÊN</h3>
        <button onClick={onClose} className="chat-close-btn">
          &times;
        </button>
      </div>
      <div className="chat-body">
        {messages.length === 0 ? (
          <p className="text-muted">👉 HÃY BẮT ĐẦU NHẮN TIN...</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`chat-message ${
                m.sender === (localStorage.getItem("accountName") || "Khách")
                  ? "me"
                  : "Admin"
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
		  onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={sending}>
          {sending ? "Đang gửi..." : "GỬI"}
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
        <div className="chat-bubble-label">NHẮN TỚI NHÂN VIÊN</div>
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