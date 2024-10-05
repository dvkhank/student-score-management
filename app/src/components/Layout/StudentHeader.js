import { Link } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "../Auth/UserContext";
import { useEffect, useState } from "react";

function StudentHeader() {
  const [notifications, setNotifications] = useState([]);

  const supabase = useSupabaseClient();
  const { userInfo } = useUser();
  const [error, setError] = useState(null);
  const studentId = userInfo.studentId;

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select()
        .eq("student_id", studentId)
        .order("created_at", { ascending: true });

      if (error) {
        setError("Could not fech the notifications");
        setNotifications([]);
        console.log(error);
      }
      if (data) {
        console.log(data);
        setNotifications(data);
        setError(null);
      }
    };
    fetchData();

    const subscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          console.log("Full payload received:", payload);
          console.log("New notification received:", payload.new);
          setNotifications((current) => [...current, payload.new]);
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to realtime channel successfully");
        } else if (status === "TIMED_OUT") {
          console.error("Subscription to realtime channel timed out", err);
        } else if (status === "CLOSED") {
          console.log("Realtime channel subscription closed");
        } else if (err) {
          console.error("Error during subscription:", err);
        }
      });
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/activities" className="nav-link">
              Activities
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/missing-activities" className="nav-link">
              Claim for missing activities
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/scores" className="nav-link">
              See your scores
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/chat-admin" className="nav-link">
              Chatchit
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/student/chat-gemini" className="nav-link">
              Study with Gemini
            </Link>
          </li>
          <li>
            <Link to="/student/certificates" className="nav-link">
              See your certificates{" "}
            </Link>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Navbar Search */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="navbar-search"
              href="#"
              role="button"
            >
              <i className="fas fa-search" />
            </a>
            <div className="navbar-search-block">
              <form className="form-inline">
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>

          {/* Notifications Dropdown */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell" />
              {notifications.length > 0 && (
                <span className="badge badge-warning navbar-badge">
                  {notifications.length}
                </span>
              )}
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                {notifications.length} Notifications
              </span>
              {notifications.map((notif, index) => (
                <>
                  <div key={index} className="dropdown-divider" />
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-envelope mr-2" />
                    {notif.message}
                    <span className="float-right text-muted text-sm">
                      {new Date(notif.created_at).toDateString()}{" "}
                      {new Date(notif.created_at).toLocaleTimeString()}
                    </span>
                  </a>
                </>
              ))}
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </div>
  );
}

export default StudentHeader;
