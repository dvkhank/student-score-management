import React from "react";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import {
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
  Table,
  Button,
} from "react-bootstrap";
import MySprinner from "../Commons/MySprinner";
import { useNavigate } from "react-router-dom";
import SideNav from "../Layout/SideNav";
function StudentHome() {
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
      let url = `${endpoints["activities"]}?keyword=${keyword}&page=${page}`;

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
      <SideNav></SideNav>
      <div>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <h1 className="text-info">HELLO SINH VIEN</h1>
            </div>
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
              {/* /.row */}
              {/* Main row */}
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
                                <Button className="btn btn-info mr-1">
                                  Details
                                </Button>
                                <Button className="btn btn-success">
                                  Enroll
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

export default StudentHome;
