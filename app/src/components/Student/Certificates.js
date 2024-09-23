import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "../Auth/UserContext";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";

function Certificates() {
  const supabase = useSupabaseClient();
  const { userInfo } = useUser();
  console.log(userInfo.userId);

  const [certificates, setCertificates] = useState([]);
  const fetchCertificates = async () => {
    const { data } = await supabase
      .from("certificates")
      .select()
      .eq("user_id", userInfo.userId)
      .order("created_at", { ascending: true });
    setCertificates(data || []);
  };
  useEffect(() => {
    fetchCertificates();
  }, []);

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease-in-out",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
  };

  const cardHoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
  };

  const imgStyle = {
    width: "100%",
    height: "300px",
    objectFit: "contain",
    backgroundColor: "#f8f9fa", // Màu nền nhạt để lấp khoảng trống
  };

  const handleMouseEnter = (event) => {
    event.currentTarget.style.transform = "scale(1.05)";
    event.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
  };

  const handleMouseLeave = (event) => {
    event.currentTarget.style.transform = "scale(1)";
    event.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
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
                {certificates.length > 0 ? (
                  certificates.map((certificate, index) => (
                    <div
                      className="col-md-4 mb-4"
                      key={index}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={cardStyle}
                    >
                      <a
                        href={certificate.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="card">
                          <img
                            src={certificate.certificate} // Đường dẫn đến ảnh chứng chỉ
                            alt={`Certificate ${index + 1}`}
                            className="card-img-top"
                            style={imgStyle} // Đảm bảo ảnh sẽ giữ nguyên tỷ lệ mà không bị cắt
                          />
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No certificates found.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>{" "}
    </>
  );
}
export default Certificates;
