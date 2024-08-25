import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PrivateRoute = ({ element: Element, allowedRoles }) => {
  const { userInfo, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo) {
    // Chuyển hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userInfo.role)) {
    // Chuyển hướng đến trang không có quyền nếu người dùng không có vai trò phù hợp
    return <Navigate to="/unauthorized" />;
  }

  // Hiển thị thành phần được bảo vệ
  return <Element />;
};

export default PrivateRoute;
