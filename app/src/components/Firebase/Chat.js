import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, firestore } from "../Firebase/firebase"; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn
import { format } from "date-fns";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(firestore, "messages"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        timestamp: Timestamp.fromDate(new Date()),
        userId: auth.currentUser?.uid || "Anonymous",
        userName: auth.currentUser?.displayName || "Anonymous",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  return (
    <div
      style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}
    >
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: "10px" }}>
            <strong>{message.userName}:</strong> {message.text}
            <div style={{ fontSize: "smaller", color: "#888" }}>
              {message.timestamp.toDate() &&
                format(message.timestamp.toDate(), "Pp")}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%" }}
      />
      <button onClick={handleSendMessage} style={{ width: "15%" }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
