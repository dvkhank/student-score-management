import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { format } from "date-fns";
import APIs, { endpoints } from "../../configs/APIs";
import { Button } from "react-bootstrap";
import { useUser } from "../Auth/UserContext";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";

function Comments() {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss"); // Định dạng theo ý muốn
  };
  const [newComment, setNewComment] = useState(""); // Trạng thái cho comment mới
  const supabase = useSupabaseClient();
  const [activityInfo, setActivityInfo] = useState();
  const [comments, setComments] = useState([]);
  const { id } = useParams(); // Lấy ID từ URL
  const { userInfo } = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select()
        .order("created_at", { ascending: true });
      setComments(data);
    };

    fetchComments();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("comment channels")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        (payload) => {
          setComments((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [id]);
  const loadActivityById = async () => {
    try {
      const res = await APIs.get(`${endpoints["activities"]}/${id}`, {
        headers: {
          Authorization: userInfo.token, // Thêm token vào header
        },
      });
      setActivityInfo(res.data);
      console.log(res.data);
    } catch {
      console.log("Loi roi");
    }
  };
  useEffect(() => {
    loadActivityById();
  }, []);

  const query = async (data) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  };

  const handleCommentSubmit = async () => {
    const sentimentResult = await query({ inputs: newComment });
    let sentiment; // Khai báo biến sentiment

    if (sentimentResult && sentimentResult.length > 0) {
      const scores = sentimentResult[0];
      const positiveScore = scores.find(
        (score) => score.label === "POSITIVE"
      ).score; // Tìm điểm POSITIVE
      const negativeScore = scores.find(
        (score) => score.label === "NEGATIVE"
      ).score; // Tìm điểm NEGATIVE

      sentiment = positiveScore > negativeScore;
    } else {
      console.log("No sentiment result returned");
    }

    // Thêm logic để insert vào Supabase ở đây
    // Thêm bình luận vào Supabase
    const { data, error } = await supabase.from("comments").insert([
      {
        content: newComment,
        sentiment: sentiment,
        name: userInfo.firstName + " " + userInfo.lastName,
        activity_id: id,
      },
    ]);

    if (error) {
      console.log("Error inserting comment:", error);
    }
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
                \{" "}
                <div
                  style={{
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    maxWidth: "600px",
                    margin: "auto",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {activityInfo ? (
                    <div>
                      <h1 style={{ fontSize: "24px", color: "#333" }}>
                        {activityInfo.name}
                      </h1>
                      <p style={{ fontStyle: "italic" }}>
                        <strong>Description:</strong> {activityInfo.description}
                      </p>
                      <p>
                        <strong>Activity Type:</strong>{" "}
                        {activityInfo.activityKind.description} (Max Score:{" "}
                        {activityInfo.activityKind.maxScore})
                      </p>
                      <p>
                        <strong>Faculty:</strong> {activityInfo.faculty.name}
                      </p>
                      <p>
                        <strong>Score:</strong> {activityInfo.score} /{" "}
                        {activityInfo.activityKind.maxScore}
                      </p>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(activityInfo.startDate).toLocaleString()}
                      </p>
                      <p>
                        <strong>Semester:</strong>{" "}
                        {activityInfo.period.semester} Year{" "}
                        {activityInfo.period.year}
                      </p>
                      <p>
                        <strong>Money:</strong> {activityInfo.money} VND
                      </p>
                    </div>
                  ) : (
                    <p>Loading activity information...</p>
                  )}
                </div>
                {/* Form nhập bình luận */}
                <div style={{ marginTop: "20px" }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    style={{ width: "100%", height: "100px" }}
                  />
                  <Button
                    onClick={handleCommentSubmit}
                    style={{
                      marginTop: "10px",
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Submit Comment
                  </Button>
                </div>
                <ul>
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        margin: "10px 0",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor:
                          comment.sentiment === true ? "#e6ffed" : "#ffe6e6",
                        color: comment.sentiment === true ? "green" : "red",
                      }}
                    >
                      <strong style={{ marginRight: "10px" }}>
                        {comment.name}
                      </strong>
                      <span>{comment.content}</span>
                      <small
                        style={{ marginLeft: "auto", fontStyle: "italic" }}
                      >
                        {formatDate(comment.created_at)}
                      </small>
                      <span style={{ marginLeft: "10px" }}>
                        {comment.sentiment === true ? "😊" : "😞"}
                      </span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default Comments;
