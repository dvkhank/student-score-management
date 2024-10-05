import { useEffect, useState } from "react";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";
import APIs, { endpoints } from "../../configs/APIs";
import { Button, Container, Form, Modal, Navbar, Table } from "react-bootstrap";
import MySprinner from "../Commons/MySprinner";
import { useUser } from "../Auth/UserContext";

function MissingActivities() {
  const { userInfo } = useUser();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [missingActivities, setMissingActivities] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [image, setImage] = useState(null);
  const [textareaContent, setTextareaContent] = useState("");
  // Hàm để xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Hàm để xử lý khi nội dung trong textarea thay đổi
  const handleTextareaChange = (e) => {
    setTextareaContent(e.target.value);
  };

  // Hiển thị Modal khi người dùng ấn nút "Claim"
  const showClaimModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  // Ẩn Modal sau khi hoàn tất
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Hàm xử lý submit form và fetch API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", textareaContent);
    formData.append("activityId", selectedActivity.id);
    formData.append("userId", userInfo.userId);

    try {
      setLoading(true);
      const res = await APIs.put(endpoints["update_participation"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: userInfo.token, // Thêm token vào header
        },
      });
      console.log(res.data); // Xử lý phản hồi từ API
      setShowModal(false); // Ẩn Modal sau khi submit thành công
      alert("Claim successfully");
      await loadMissingActivities();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event) => {
    const periodId = event.target.value;
    setSelectedPeriod(periodId);
  };
  const loadMissingActivities = async () => {
    setLoading(true);
    try {
      const res = await APIs.get(
        `${endpoints["missing_activities"]}?userId=${userInfo.userId}&periodId=${selectedPeriod}`,
        {
          headers: {
            Authorization: userInfo.token, // Thêm token vào header
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
  const loadPeriods = async () => {
    try {
      const res = await APIs.get(endpoints["periods"]);
      setPeriods(res.data);
    } catch {
      console.log("Loi roi");
    }
  };
  useEffect(() => {
    loadPeriods();
  }, []);
  useEffect(() => {
    loadMissingActivities();
  }, [selectedPeriod]);

  return (
    <>
      <StudentHeader />
      <SideNav />
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
                        {missingActivities.map((a) => (
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
                              <Button
                                className="btn btn-info mr-1"
                                onClick={() => showClaimModal(a)}
                              >
                                Claim
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
          <Modal.Title>Upload Image & Add Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Upload your evidence:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={textareaContent}
                onChange={handleTextareaChange}
              />
            </Form.Group>
            <Button type="submit" className="mt-2 btn btn-success">
              Gửi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default MissingActivities;
