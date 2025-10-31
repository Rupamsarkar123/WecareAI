import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      // Limit response to 3 lines
      let reply = response.data.reply.split("\n").slice(0, 3).join("\n");

      setMessages([...newMessages, { text: reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { text: "Sorry, I couldn't process that.", sender: "bot" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <img src="/mt.svg" alt="Logo" style={styles.logoImage} />
          <a
            href="https://wecare-ai.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h2 style={styles.logo}>WeCare</h2>
          </a>
        </div>
      </header>

      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {msg.sender === "bot" && (
                <img src="/bot.png" alt="Bot" style={styles.avatar} />
              )}

              <span
                style={{
                  maxWidth: "70%",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  fontSize: "14px",
                  backgroundColor:
                    msg.sender === "user" ? "#007bff" : "#e0e0e0",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                  margin: msg.sender === "user" ? "0 10px 0 0" : "0 0 0 10px",
                }}
              >
                {msg.text}
              </span>

              {msg.sender === "user" && (
                <img src="/useri.png" alt="User" style={styles.avatar} />
              )}
            </div>
          ))}

          {loading && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              Typing...
            </div>
          )}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            style={styles.sendButton}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>Copyright © 2024 WeCare | All rights reserved</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
  },

  header: {
    width: "100%",
    backgroundColor: "#2CA58D",
    color: "white",
    padding: "15px 30px",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
  },
  logoImage: {
    width: "40px",
    height: "40px",
    marginRight: "10px",
  },
  logo: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  chatBox: {
    width: "550px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    margin: "150px 0 40px",
    padding: "15px",
  },
  messages: {
    height: "350px",
    overflowY: "auto",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
  },
  sendButton: {
    backgroundColor: "#007bff",
    border: "none",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    marginLeft: "10px",
  },
  footer: {
    width: "100%",
    backgroundColor: "#2CA58D",
    color: "white",
    textAlign: "center",
    padding: "15px 0",
    position: "fixed",
    bottom: 0,
    left: 0,
    borderRadius: "10px",
    fontSize: "20px",
  },
};

export default ChatBot;
