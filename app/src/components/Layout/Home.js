import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import {
  Button,
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
  Table,
} from "react-bootstrap";
import MySprinner from "../Commons/MySprinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideNav from "./SideNav";
import Header from "./StudentHeader";
import AdminHeader from "./AdminHeader";
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

  const [page, setPage] = useState(1);
  const [activityKindId, setActivityKindId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadActivities = async () => {
    setLoading(true);
    try {
      let url = `${endpoints["admin_activities"]}?keyword=${keyword}&page=${page}`;

      if (activityKindId) {
        url = `${url}&activityKindId=${activityKindId}`;
      }
      const res = await APIs.get(url);
      if (page === 1) setActivities(res.data);
      else
        setActivities((current) => {
          return [...current, ...res.data];
        });
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadActivities();
  }, [keyword, activityKindId, page]);

  useEffect(() => {
    loadKinds();
  }, []);
  const navigator = useNavigate();

  function addAnActivity() {
    navigator("/admin/add-activity");
  }
  const editActivity = (id) => {
    navigator(`/admin/edit-activity/${id}`);
  };

  const deleteActivity = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!isConfirmed) {
      return;
    }
    try {
      await axios.delete(`${endpoints["admin_activities"]}/${id}`);
      alert("Activity deleted successfully");
      loadActivities(); // Reload the activities list
    } catch (err) {
      console.error(err);
    }
  };
  const searchKind = (e, activityKindId) => {
    e.preventDefault();
    setActivityKindId(activityKindId);
  };
  const loadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <SideNav />
      <AdminHeader />

      <div>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid"></div>
          </div>
          <section className="content">
            <div className="container-fluid">
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
                            <Nav.Link
                              key={k.id}
                              onClick={(e) => searchKind(e, k.id)}
                            >
                              Kind {k.id}
                            </Nav.Link>
                          ))}
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>
                </>
              )}
              <Form className="d-inline">
                <Row className="mb-3">
                  <Col xs="auto">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className=" mr-sm-2"
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                    />
                  </Col>
                </Row>
              </Form>
              <Button onClick={addAnActivity} className="btn btn-primary mb-3">
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
                                  className="btn btn-danger m-1"
                                  onClick={() => deleteActivity(a.id)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <button
                        onClick={loadMore}
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        Load more
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
