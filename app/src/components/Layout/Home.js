import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Button, Container, Nav, Navbar, Table } from "react-bootstrap";
import MySprinner from "../Commons/MySprinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Home() {
  const [kinds, setKinds] = useState(null);
  const loadKinds = async () => {
    try {
      const res = await APIs.get(endpoints["kinds"]);
      setKinds(res.data);

      console.log(kinds);
    } catch (ex) {
      console.error("Something wrong");
    }
  };

  useEffect(() => {
    loadKinds();
  }, []);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await APIs.get(endpoints["activities"]);
      setActivities(res.data);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadActivities();
  }, []);
  const navigator = useNavigate();

  function addAnActivity() {
    navigator("/add-activity");
  }
  const editActivity = (id) => {
    navigator(`/edit-activity/${id}`);
  };

  const deleteActivity = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!isConfirmed) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/activities/${id}`);
      alert("Activity deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid"></div>
            {/* /.container-fluid */}
          </div>
          {/* /.content-header */}
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}

              {kinds === null ? (
                <MySprinner />
              ) : (
                <>
                  <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                      <Navbar.Brand>Student Score Management</Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                          {kinds.map((k) => (
                            <Nav.Link key={k.id}>Kind {k.id}</Nav.Link>
                          ))}
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>
                </>
              )}
              {/* /.row */}
              {/* Main row */}
              <Button onClick={addAnActivity} className="btn btn-primary">
                Add an activity
              </Button>
              <div className="row">
                <div className="container text-center">
                  {loading === true ? (
                    <MySprinner />
                  ) : (
                    <>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Score</th>
                            <th>Kind</th>
                            <th>Faculty</th>
                            <th>Period</th>
                            <th>Money</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activities.map((a) => (
                            <tr key={a.id}>
                              <td>{a.id}</td>
                              <td>{a.name}</td>
                              <td>{a.description}</td>
                              <td>{a.score}</td>
                              <td>{a.activityKind.id}</td>
                              <td>{a.faculty.name}</td>
                              <td>
                                Semester {a.period.semester} - Year{" "}
                                {a.period.year}
                              </td>
                              <td>{a.money === 0 ? "Free" : a.money}</td>
                              <td>
                                <Button
                                  onClick={() => editActivity(a.id)}
                                  className="btn btn-info"
                                >
                                  Edit
                                </Button>
                                <Button
                                  className="btn btn-danger"
                                  onClick={() => deleteActivity(a.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                </div>
              </div>
              {/* /.row (main row) */}
            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}
        </div>
      </div>
    </>
  );
}

export default Home;
