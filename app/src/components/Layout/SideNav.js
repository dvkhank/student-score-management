import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import MySprinner from "../Commons/MySprinner";
import { Card, CardBody, ListGroup } from "react-bootstrap";

function SideNav() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/userinfo", {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      setUserInfo(res.data);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token from sessionStorage
    navigate("/"); // Redirect to the login page
  };
  if (loading) {
    return <MySprinner />;
  }
  if (!userInfo) {
    return <div>Error: Unable to fetch user info</div>;
  }
  return (
    <div>
      <aside className="main-sidebar text-center elevation-4">
        <Card>
          <CardBody>
            <img
              width="100"
              height="100"
              src={userInfo.avatar || "/default-avatar.png"}
            />
          </CardBody>
          <Card.Body>{`${userInfo.firstName || "User"} ${
            userInfo.lastName || ""
          }`}</Card.Body>
          <Card.Body>Class: {userInfo.class || "N/A"}</Card.Body>
          <Card.Body>Start Year: {userInfo.startYear || "N/A"}</Card.Body>
          <Card.Body>Faculty: {userInfo.faculty || "N/A"}</Card.Body>
        </Card>
      </aside>
    </div>
  );
}

export default SideNav;
