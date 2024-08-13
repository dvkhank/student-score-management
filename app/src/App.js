import "./App.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./components/Layout/Home";
import SideNav from "./components/Layout/SideNav";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activity from "./components/Activity/Activity";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-activity" element={<Activity />} />
        </Routes>
        <SideNav />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
