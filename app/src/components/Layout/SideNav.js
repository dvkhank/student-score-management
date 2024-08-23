import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MySprinner from "../Commons/MySprinner";
import { Card, CardBody, ListGroup } from "react-bootstrap";
import { useUser } from "../Auth/UserContext";

function SideNav() {
  const navigate = useNavigate();
  const { userInfo, loading } = useUser();
  console.log(userInfo);
  console.log(loading);
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
          <CardBody>Email: {userInfo.email}</CardBody>
          <Card.Body>Class: {userInfo.class || "N/A"}</Card.Body>
          <Card.Body>Start Year: {userInfo.startYear || "N/A"}</Card.Body>
          <Card.Body>Faculty: {userInfo.faculty || "N/A"}</Card.Body>
        </Card>
        <button onClick={handleLogout} className="btn btn-primary">
          Logout
        </button>
      </aside>
    </div>
  );
}

export default SideNav;
