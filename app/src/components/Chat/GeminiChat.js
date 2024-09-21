import axios from "axios";
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";

function GeminiChat() {
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store all messages

  const apiKey = process.env.REACT_APP_API_GEMINI;
  const sendMessage = async () => {
    if (!message.trim()) return;

    // Store user message
    const newMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: message, // Nội dung tin nhắn mà bạn muốn gửi
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo đúng kiểu header
          },
        }
      );
      // Xử lý phản hồi từ API
      const generatedContent =
        response.data.candidates[0].content.parts[0].text ||
        "No response from API";
      const geminiMessage = { text: generatedContent, sender: "gemini" };
      setMessages((prev) => [...prev, geminiMessage]);
      setMessage(""); // Clear input field
      setResponseMessage(generatedContent);
    } catch (error) {
      console.error("Error sending message to Gemini API:", error);
      setResponseMessage("Error occurred while sending message.");
    }
  };
  const chatBoxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  };

  const messagesStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
  };

  const messageStyle = {
    padding: "8px",
    borderRadius: "5px",
    margin: "5px 0",
    maxWidth: "70%",
  };

  return (
    <>
      <SideNav></SideNav>
      <StudentHeader></StudentHeader>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid"></div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="container text-center">
                <h2>Study with Gemini</h2>
                <div style={chatBoxStyle} className="chat-box">
                  <div style={messagesStyle} className="messages">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          ...messageStyle,
                          alignSelf:
                            msg.sender === "user" ? "flex-end" : "flex-start",
                          backgroundColor:
                            msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <FormControl
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                  />
                  <Button onClick={sendMessage}>ASK</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default GeminiChat;
