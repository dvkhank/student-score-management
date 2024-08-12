import "./App.css";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Home from "./components/Layout/Home";
import SideNav from "./components/Layout/SideNav";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <div className="wrapper">
      <Header />
      <Home />
      <SideNav />
      <Footer />
    </div>
  );
}

export default App;
