/* eslint-disable */
import React from "react";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useSession } from "@supabase/auth-helpers-react";
import {
  Col,
  Container,
  Form,
  Nav,
  Navbar,
  Row,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import MySprinner from "../Commons/MySprinner";
import SideNav from "../Layout/SideNav";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useUser } from "../Auth/UserContext";
import StudentHeader from "../Layout/StudentHeader";

function StudentHome() {
  const session = useSession();
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
  const [periods, setPeriods] = useState([]);
  const [page, setPage] = useState(1);
  const [activityKindId, setActivityKindId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const handlePeriodChange = (event) => {
    const periodId = event.target.value;
    setSelectedPeriod(periodId);
  };
  const loadActivities = async () => {
    setLoading(true);

    try {
      // Lấy userInfo từ sessionStorage và phân tích chuỗi JSON
      const userInfoString = sessionStorage.getItem("userInfo");
      if (!userInfoString) {
        throw new Error("User info not found in session storage");
      }
      const userInfo = JSON.parse(userInfoString);
      if (!userInfo || !userInfo.userId) {
        throw new Error("User info or userId is missing");
      }
      console.log(typeof userInfo.userId); // Kiểm tra kiểu dữ liệu

      // Tạo URL với tham số userId
      let url = `${endpoints["activities"]}?keyword=${keyword}&page=${page}&periodId=${selectedPeriod}&userId=${userInfo.userId}`;

      if (activityKindId) {
        url = `${url}&activityKindId=${activityKindId}`;
      }

      // Gọi API
      const res = await APIs.get(url);
      if (page === 1) {
        setActivities(res.data);
      } else {
        setActivities((current) => [...current, ...res.data]);
      }
    } catch (ex) {
      console.error("Failed to load activities:", ex.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadActivities();
  }, [keyword, activityKindId, page, selectedPeriod]);

  useEffect(() => {
    loadKinds();
    loadPeriods();
  }, []);
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
    clientId: process.env.REACT_APP_CLIENTID_PAYPAL,
    currency: "USD",
    intent: "capture",
  };
  const loadPeriods = async () => {
    try {
      const res = await APIs.get(endpoints["periods"]);
      setPeriods(res.data);
    } catch {
      console.log("Loi roi");
    }
  };

  const handleSuccessPayment = async (details, activity) => {
    setLoading(true); // Bắt đầu tải khi thanh toán thành công

    try {
      const participationData = {
        activityId: activity.id,
        userId: userInfo.userId,
        parcipatedDate: new Date().toISOString().split("T")[0],
        request: false,
        active: true,
        description: "Payment successful",
        evidence: details.id,
      };

      await APIs.post(endpoints["add_participation"], participationData);

      const event = {
        summary: activity.name,
        description: activity.description,
        start: {
          dateTime: new Date(activity.startDate).toISOString(), // Chuyển đổi startDate sang định dạng ISO
          timeZone: "Asia/Ho_Chi_Minh",
        },
        end: {
          dateTime: new Date(
            new Date(activity.startDate).getTime() + 60 * 60 * 1000
          ).toISOString(), // Giả sử sự kiện kéo dài 1 giờ
          timeZone: "Asia/Ho_Chi_Minh",
        },
      };

      // Gọi API Google Calendar để tạo sự kiện
      const res = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.provider_token}`, // Gửi access token
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event), // Gửi dữ liệu sự kiện
        }
      );
      if (res.ok) {
        alert("Tạo sự kiện thành công!"); // Thông báo thành công
      } else {
        const errorResponse = await res.json();
        console.error("Lỗi khi tạo sự kiện:", errorResponse);
        alert("Không thể tạo sự kiện trên Google Calendar.");
      }
      loadActivities();
    } catch (error) {
      console.error("Error saving participation", error);
    } finally {
      setLoading(false); // Kết thúc tải khi hoàn tất
    }
  };
  const handleEnroll = async (activity) => {
    try {
      setLoading(true);
      // Tạo dữ liệu sự kiện
      const event = {
        summary: activity.name,
        description: activity.description,
        start: {
          dateTime: new Date(activity.startDate).toISOString(), // Chuyển đổi startDate sang định dạng ISO
          timeZone: "Asia/Ho_Chi_Minh",
        },
        end: {
          dateTime: new Date(
            new Date(activity.startDate).getTime() + 60 * 60 * 1000
          ).toISOString(), // Giả sử sự kiện kéo dài 1 giờ
          timeZone: "Asia/Ho_Chi_Minh",
        },
      };

      // Gọi API Google Calendar để tạo sự kiện
      const res = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.provider_token}`, // Gửi access token
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event), // Gửi dữ liệu sự kiện
        }
      );

      if (res.ok) {
        const data = await res.json();
        const participationData = {
          activityId: activity.id,
          userId: userInfo.userId,
          parcipatedDate: new Date().toISOString().split("T")[0],
          request: false,
          active: false,
          description: "Enroll successful",
        };
        // Gửi dữ liệu về backend
        await APIs.post(endpoints["add_participation"], participationData);
        alert("Sự kiện đã được đăng kí thành công trên Google Calendar!");
        loadActivities();
      } else {
        const error = await res.json();
        console.error("Lỗi khi tạo sự kiện:", error);
        alert("Không thể tạo sự kiện, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <SideNav />
      <>{session.user && session.user.id ? <StudentHeader /> : <Spinner />}</>

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
                      <Form.Group>
                        <Form.Label htmlFor="period-select">
                          Choose a period:
                        </Form.Label>
                        <Form.Select
                          id="period-select"
                          value={selectedPeriod}
                          onChange={handlePeriodChange}
                        >
                          <option value="">-- Choose a period --</option>
                          {/* Bước 3: Hiển thị các options từ periods */}
                          {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                              Semester: {period.semester} - Year: {period.year}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
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
                            <th>Date</th>
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
                              <td>{a.startDate}</td>
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
                                  <Button
                                    onClick={() => handleEnroll(a)} // Thêm sự kiện khi ấn nút Enroll
                                    className="btn btn-primary"
                                  >
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default StudentHome;
