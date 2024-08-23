import React, { useState } from "react";
import "../Auth/Style.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "./UserContext";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const { setUserInfo } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });
      const token = response.data; // Assuming token is returned as plain string
      sessionStorage.setItem("token", token);
      // Redirect based on role
      if (role === "Student") {
        navigate("/student/");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const token = response.credential;
      sessionStorage.setItem("token", token);

      // Fetch user info from your backend using the token
      const res = await axios.get("http://localhost:8080/api/userinfo", {
        headers: { Authorization: token },
      });
      setUserInfo(res.data);

      navigate("/student/");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed:", error);
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center 100-vh bg-primary">
      <div className="form_container p-5 rounded bg-white">
        <form>
          <h3 className="text-center">Login</h3>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <div className="mb-2">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <input
              type="checkbox"
              className="custom-control custom-checkbox"
              id="check"
            />
            <label className="custom-input-label ms-2" htmlFor="check">
              Remember me
            </label>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Login
            </button>
          </div>
          <div className="d-grid mt-3">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
            />
          </div>

          <p className="text-right">
            <Link to={"/signup"}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
