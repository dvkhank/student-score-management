import "./App.css";
import Footer from "./components/Layout/Footer";
import Home from "./components/Layout/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activity from "./components/Activity/Activity";
import EditActivity from "./components/Activity/EditActivity";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import StudentHome from "./components/Student/StudentHome";
import MissingActivities from "./components/Student/MissingActivities";
import { UserProvider } from "./components/Auth/UserContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminMissingActivities from "./components/Activity/MissingActivities";
import ScoreDetails from "./components/Student/ScoreDetails";
import Stats from "./components/Layout/Stats";
import StudentChat from "./components/Chat/StudentChat";
import GeminiChat from "./components/Chat/GeminiChat";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/add-activity" element={<Activity />} />
          <Route path="/admin/" element={<Home />} />
          <Route path="/student/" element={<StudentHome />} />
          <Route path="/admin/edit-activity/:id" element={<EditActivity />} />
          <Route
            path="/student/missing-activities"
            element={<MissingActivities />}
          />
          <Route
            path="/admin/missing-activities"
            element={<AdminMissingActivities />}
          />
          <Route path="/student/scores" element={<ScoreDetails />} />
          <Route path="/admin/stats" element={<Stats />} />
          <Route path="/student/chat-admin" element={<StudentChat />} />
          <Route path="/student/chat-gemini" element={<GeminiChat />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
