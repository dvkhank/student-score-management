import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useUser } from "../Auth/UserContext";
import APIs, { endpoints } from "../../configs/APIs";
import StudentHeader from "../Layout/StudentHeader";
import SideNav from "../Layout/SideNav";
import { CircularProgressbar } from "react-circular-progressbar";

function Progress() {
  const { userInfo } = useUser();
  const [data, setData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const scoreByKind = async () => {
    try {
      const res = await APIs.get(
        `${endpoints["score_by_kind"]}?userId=${userInfo.userId}&periodId=${1}`,
        {
          headers: {
            Authorization: userInfo.token, // Thêm token vào header
          },
        }
      );
      setData(res.data);
    } catch {
      console.log("Loi roi");
    }
  };
  useEffect(() => {
    scoreByKind();
  }, []);
  // Tính tổng điểm từ dữ liệu nhận được
  useEffect(() => {
    const total = data.reduce((acc, item) => acc + item[3], 0);
    setTotalScore(total);
  }, [data]);
  const maxScore = 100;

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
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    marginBottom: "20px",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  PROGRESS
                </h3>
                <div
                  style={{ margin: "0 auto", width: "200px", height: "200px" }}
                >
                  <CircularProgressbar
                    value={(totalScore / maxScore) * 100} // Tính phần trăm
                    styles={{
                      path: {
                        stroke: "#FF69B4", // Màu hồng cho thanh tiến độ
                        strokeWidth: 8, // Độ dày của thanh tiến độ
                      },
                      trail: {
                        stroke: "#e9ecef", // Màu nền
                        strokeWidth: 8, // Độ dày của màu nền
                      },
                    }}
                  />
                </div>
                {/* Di chuyển tổng điểm xuống dưới vòng tròn */}
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {totalScore} / {maxScore} {/* Hiển thị tổng điểm ở đây */}
                </div>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <h4
                        style={{
                          fontSize: "18px",
                          marginBottom: "8px",
                          color: "#007bff",
                          fontWeight: "bold",
                        }}
                      >
                        Kind {item[0]}: {item[1]}
                      </h4>
                      <ProgressBar
                        now={(item[3] / item[2]) * 100}
                        label={`${item[3]} / ${item[2]}`}
                        variant="success"
                        style={{
                          height: "35px",
                          backgroundColor: "#e9ecef", // Màu nền của progress bar
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>Không có dữ liệu để hiển thị.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default Progress;
