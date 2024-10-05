import { useEffect, useState } from "react";
import AdminHeader from "../Layout/AdminHeader";
import SideNav from "../Layout/SideNav";
import APIs, { endpoints } from "../../configs/APIs";
import MySprinner from "../Commons/MySprinner";
import { Button, Container, Form, Modal, Navbar, Table } from "react-bootstrap";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

function MissingActivities() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [missingActivities, setMissingActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMissingActivity, setSelectedMissingActivity] = useState(null);
  const supabase = useSupabaseClient();

  const handlePeriodChange = (event) => {
    const periodId = event.target.value;
    setSelectedPeriod(periodId);
  };
  const loadPeriods = async () => {
    try {
      const res = await APIs.get(endpoints["periods"]);
      setPeriods(res.data);
    } catch {
      console.log("Loi roi");
    }
  };
  const loadMissingActivities = async () => {
    setLoading(true);
    try {
      const res = await APIs.get(
        `${endpoints["admin_missing"]}?&periodId=${selectedPeriod}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("token"), // Thêm token vào header
          },
        }
      );
      setMissingActivities(res.data);
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPeriods();
  }, []);
  useEffect(() => {
    loadMissingActivities();
  }, [selectedPeriod]);

  const showClaimModal = (missingActivity) => {
    setSelectedMissingActivity(missingActivity);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleAccept = async () => {
    const formData = new FormData();
    formData.append("studentId", selectedMissingActivity.student.id);
    formData.append("activityId", selectedMissingActivity.activity.id);

    try {
      setLoading(true);
      const res = await APIs.put(endpoints["accept_participation"], formData, {
        headers: {
          Authorization: sessionStorage.getItem("token"), // Thêm token vào header
        },
      });
      // Send notification
      const { data, error } = await supabase.from("notifications").insert([
        {
          student_id: selectedMissingActivity.student.id,
          message: "Your activity has been accepted!",
        },
      ]);

      if (error) throw error;

      setShowModal(false);
      loadMissingActivities();
      alert("Accept Successfully");
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    const formData = new FormData();
    formData.append("studentId", selectedMissingActivity.student.id);
    formData.append("activityId", selectedMissingActivity.activity.id);

    try {
      setLoading(true);
      const res = await APIs.put(endpoints["decline_participation"], formData, {
        headers: {
          Authorization: sessionStorage.getItem("token"), // Thêm token vào header
        },
      });
      // Send notification
      const { data, error } = await supabase.from("notifications").insert([
        {
          student_id: selectedMissingActivity.student.id,
          message: "Your activity has been denied!",
        },
      ]);
      if (error) throw error;
      setShowModal(false);
      loadMissingActivities();
      alert("Decline Successfully");
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
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
              {loading === true ? (
                <MySprinner />
              ) : (
                <Navbar expand="lg" className="bg-body-tertiary">
                  <Container>
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
              )}

              {/* /.row */}
              {/* Main row */}
              {loading === true ? (
                <MySprinner />
              ) : (
                <div className="row">
                  <div className="container text-center">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Full Name</th>
                          <th>Class</th>
                          <th>Faculty</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {missingActivities.map((a) => (
                          <tr key={a.id.studentId}>
                            <td>{a.id.studentId}</td>
                            <td>
                              {a.student.user.lastname}{" "}
                              {a.student.user.firstname}
                            </td>
                            <td>{a.student.classField.name}</td>
                            <td>{a.student.classField.faculty.name}</td>
                            <td>
                              <Button
                                onClick={() => showClaimModal(a)}
                                className="btn btn-info mr-1"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Modal để hiện form */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h3>Evidence & Description</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMissingActivity && selectedMissingActivity.activity ? (
            <Form>
              <Form.Group>
                <Form.Label>Activity Name : </Form.Label>{" "}
                {selectedMissingActivity.activity.name}
              </Form.Group>
              <Form.Group>
                <Form.Label>Activity Kind : </Form.Label>{" "}
                {selectedMissingActivity.activity.activityKind.id}
              </Form.Group>
              <Form.Group>
                <Form.Label>Activity Score : </Form.Label>{" "}
                {selectedMissingActivity.activity.score}
              </Form.Group>
              <Form.Group>
                <Form.Label>Activity Period : </Form.Label> Semester:{" "}
                {selectedMissingActivity.activity.period.semester}
                {" - "}
                Year: {selectedMissingActivity.activity.period.year}
              </Form.Group>
              <Form.Group>
                <Form.Label>Student Description : </Form.Label>{" "}
                {selectedMissingActivity.description}
              </Form.Group>
              <Form.Group>
                <Form.Label>Activity Evidence : </Form.Label>
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  src={selectedMissingActivity.evidence}
                  alt="Evidence"
                />
              </Form.Group>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleAccept();
                }}
                type="button"
                className="mt-2 mr-2 btn btn-success"
              >
                Accept
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDecline();
                }}
                type="button"
                className="mt-2 btn btn-danger"
              >
                Decline
              </Button>
            </Form>
          ) : (
            <MySprinner />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
export default MissingActivities;
