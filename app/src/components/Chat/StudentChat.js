import { Button, Form } from "react-bootstrap";
import { useUser } from "../Auth/UserContext";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useRef, useState } from "react";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";
function StudentChat() {
  const { userInfo } = useUser();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState(null);
  const supabase = useSupabaseClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Thêm useRef cho input file
  const messagesEndRef = useRef(null); // Thêm ref cho phần cuối của danh sách tin nhắn

  useEffect(() => {
    // Cuộn tự động đến cuối khi có tin nhắn mới
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // Hàm xử lý khi người dùng thay đổi input tin nhắn
  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleSelectedFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select()
        .order("created_at", { ascending: true });

      if (error) {
        setError("Failed to fetch messages");
        console.log(error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("New message received:", payload.new);
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  const uploadFile = async (selectedFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${userInfo.userId}/${selectedFile.name}`, selectedFile);

      if (error) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate URL for the uploaded file

      const bucketURL =
        "https://wskbzrgavbinkjdjlfbt.supabase.co/storage/v1/object/public/images";
      const filePath = `${userInfo.userId}/${selectedFile.name}`;
      const publicURL = `${bucketURL}/${filePath}`;
      console.log("Public URL:", publicURL);
      return publicURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    let imageUrl = null;

    if (selectedFile) {
      imageUrl = await uploadFile(selectedFile);
      setSelectedFile(null); // Reset file input
    }
    const now = new Date(); // Khai báo biến now

    const { error } = await supabase.from("messages").insert([
      {
        user_id: userInfo.userId,
        user_name: userInfo.lastName + " " + userInfo.firstName,
        content: messageText || imageUrl,
        created_at: now.toISOString(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessageText(""); // Reset message input
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <>
      <SideNav></SideNav>
      <StudentHeader></StudentHeader>
      <div>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid"></div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="container text-center">
                  {/* Chat Messages */}
                  <div
                    className="messages-list"
                    style={{
                      maxHeight: "400px",
                      overflowY: "scroll",
                      padding: "10px",
                      border: "1px solid #ddd",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            msg.user_id === userInfo.userId
                              ? "#d1e7dd"
                              : "#fff",
                          padding: "10px",
                          margin: "5px 0",
                          borderRadius: "8px",
                          maxWidth: "70%",
                          alignSelf:
                            msg.user_id === userInfo.userId
                              ? "flex-end"
                              : "flex-start",
                          textAlign:
                            msg.user_id === userInfo.userId ? "right" : "left",
                          marginLeft:
                            msg.user_id === userInfo.userId
                              ? "auto"
                              : "initial",
                          marginRight:
                            msg.user_id !== userInfo.userId ? "auto" : "10px",
                          border:
                            msg.user_id !== userInfo.userId
                              ? "1px solid #ddd"
                              : "none",
                        }}
                      >
                        <h3 style={{ color: "#666", fontSize: "20px" }}>
                          {msg.user_name}
                        </h3>
                        {msg.content && !msg.content.startsWith("http") && (
                          <p
                            style={{ fontSize: "18px", wordWrap: "break-word" }}
                          >
                            {msg.content}
                          </p>
                        )}

                        {msg.content && msg.content.startsWith("http") && (
                          <img
                            src={msg.content}
                            alt="Message"
                            style={{
                              width: "150px",
                              height: "auto",
                              borderRadius: "5px",
                              display: "block",
                              margin: "5px 0",
                            }}
                          />
                        )}
                        {/* Hiển thị thời gian tạo tin nhắn */}
                        <small style={{ color: "#666", fontSize: "12px" }}>
                          {new Date(msg.created_at).toLocaleDateString()}{" "}
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </small>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Form */}
                  <Form onSubmit={sendMessage}>
                    <Form.Control
                      type="text"
                      value={messageText}
                      onChange={handleMessageChange}
                      placeholder="Type your message"
                    />

                    <Form.Control
                      type="file"
                      onChange={handleSelectedFileChange}
                      ref={fileInputRef} // Thêm ref cho input file
                      accept="image/*"
                    />

                    <Button type="submit">Send Message</Button>
                  </Form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default StudentChat;
