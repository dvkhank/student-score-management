import "./App.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./components/Layout/Home";
import SideNav from "./components/Layout/SideNav";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activity from "./components/Activity/Activity";
import EditActivity from "./components/Activity/EditActivity";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import StudentHome from "./components/Student/StudentHome";
import { useEffect, useState } from "react";
import { UserProvider } from "./components/Auth/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/add-activity" element={<Activity />} />
          <Route path="/admin/" element={<Home />} />
          <Route path="/student/" element={<StudentHome />} />
          <Route path="/admin/edit-activity/:id" element={<EditActivity />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
