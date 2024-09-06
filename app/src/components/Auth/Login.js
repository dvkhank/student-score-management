import React, { useEffect, useState } from "react";
import "../Auth/Style.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "./UserContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();
  const { setUserInfo } = useUser();
  const supabase = useSupabaseClient();
  const session = useSession();

  async function googleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes:
            "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
        },
      });

      if (error) {
        console.log("Lỗi đăng nhập Google:", error.message);
        return;
      }

      // Lưu ý: Hàm này không chờ đợi kết quả đăng nhập vì trang sẽ chuyển hướng.
      console.log("Đang chuyển hướng đến Google để đăng nhập...");
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
    }
  }

  async function handleCallback() {
    try {
      // Lấy session từ Supabase
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error("Lỗi khi lấy session:", sessionError.message);
        return;
      }

      if (sessionData.session) {
        // Lấy thông tin người dùng từ Supabase
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Lỗi khi lấy thông tin người dùng:", userError.message);
          return;
        }

        // Gọi API của server Spring Boot để lấy thêm thông tin người dùng
        const user = userData.user;
        if (user && user.email) {
          try {
            const res = await axios.get(
              "http://localhost:8080/api/userInfoEmail",
              {
                params: { email: user.email },
              }
            );
            sessionStorage.setItem("userInfo", JSON.stringify(res.data));

            console.log(res.data);

            // Cập nhật thông tin người dùng
            setUserInfo(res.data);
            if (res.data.role === "student") {
              navigate("/student");
            } else if (res.data.role === "admin") {
              navigate("/admin"); // Ví dụ: điều hướng đến trang admin
            }
          } catch (apiError) {
            console.error("Lỗi khi gọi API:", apiError.message);
          }
        } else {
          console.log("Không tìm thấy email người dùng.");
        }
      } else {
        console.log(
          "Chưa có session. Đảm bảo rằng bạn đã đăng nhập thành công."
        );
      }
    } catch (error) {
      console.error("Lỗi không mong muốn khi xử lý callback:", error);
    }
  }

  // Gọi hàm khi trang callback được tải
  // Xử lý callback khi trang được tải
  useEffect(() => {
    handleCallback();
  }, []);
  async function signOut() {
    await supabase.auth.signOut();
  }

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
        navigate("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center 100-vh bg-primary">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Login</h3>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
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
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>

          <p className="text-right">
            <Link to={"/signup"}>Sign up</Link>
          </p>
        </form>
        <div className="d-grid mt-3">
          {session ? (
            <>
              <h2>Hiiii {session.user.email}</h2>
              <button onClick={() => signOut()}>SIGN OUT</button>
            </>
          ) : (
            <>
              <button className="btn btn-info" onClick={googleSignIn}>
                SIGN IN WITH GOOGLE
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
