// Layout.js
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import SideNav from "./SideNav";

const Layout = () => (
  <div className="wrapper">
    <Header />
    <div className="main-content">
      <SideNav />
      <div className="content">
        <Outlet /> {/* Nội dung route con sẽ được render ở đây */}
      </div>
    </div>
    <Footer />
  </div>
);

export default Layout;
