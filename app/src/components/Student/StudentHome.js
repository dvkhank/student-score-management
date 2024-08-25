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
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useUser } from "../Auth/UserContext";
import axios from "axios";
import { gapi } from "gapi-script";
import Chat from "../Firebase/Chat";

function StudentHome() {
  const [kinds, setKinds] = useState(null);
  const { userInfo } = useUser();
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
  const initialOptions = {
    clientId:
      "Abcp9NoTLYU0CLKasMOPPGEQGH2C9s0Ae823xkaOizodhCUCitKqTKdS21L7kRCk27XhaF4J9tzhaMhT",
    currency: "USD",
    intent: "capture",
  };

  const handleSuccessPayment = async (details, activity) => {
    try {
      const participationData = {
        activityId: activity.id,
        userId: userInfo.id,
        parcipatedDate: new Date().toISOString().split("T")[0],
        request: false,
        active: true,
        description: "Payment successful",
        evidence: details.id,
      };

      await APIs.post(
        "http://localhost:8080/api/participation",
        participationData
      );
      alert("Payment Successful and Participation recorded!");
    } catch (error) {
      console.error("Error saving participation", error);
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
                              <td>{a.money === 0 ? "Free" : a.money + " $"}</td>
                              <td>
                                <Button className="btn btn-info mr-1">
                                  Details
                                </Button>
                                {a.money !== 0 ? (
                                  <PayPalScriptProvider
                                    options={initialOptions}
                                  >
                                    <PayPalButtons
                                      createOrder={(data, actions) => {
                                        return actions.order.create({
                                          purchase_units: [
                                            {
                                              amount: {
                                                value: a.money.toString(),
                                              },
                                            },
                                          ],
                                        });
                                      }}
                                      onApprove={(data, actions) => {
                                        return actions.order
                                          .capture()
                                          .then((details) => {
                                            handleSuccessPayment(details, a); // Hàm xử lý thanh toán thành công
                                          });
                                      }}
                                      disableFunding={["card"]}
                                    />
                                  </PayPalScriptProvider>
                                ) : (
                                  <Button className="btn btn-primary">
                                    Enroll
                                  </Button>
                                )}
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
                <Chat /> {/* Add Chat component here */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default StudentHome;
