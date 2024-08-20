import React from "react";
import "../Auth/Style.css";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

function Signup() {
  return (
    <div className="signup template d-flex justify-content-center align-items-center 100-vh bg-primary">
      <div className="form_container p-5 rounded bg-white">
        <form>
          <h3 className="text-center">Sign up</h3>
          <div className="mb-2">
            <label htmlFor="text">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="text">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="text">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-control"
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Class</Form.Label>
            <Form.Select>
              <option>Lop1</option>
            </Form.Select>
          </Form.Group>
          <div className="mb-3 mt-3">
            <input type="file"></input>
          </div>
          <div className="d-grid">
            <button className="btn btn-primary">Sign up</button>
          </div>
          <p className="text-right">
            <Link to={"/"}>Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
