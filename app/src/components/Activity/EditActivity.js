import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import { useParams } from "react-router-dom"; // Để lấy ID từ URL

const EditActivity = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [data, setData] = useState({
    kinds: [],
    faculties: [],
    periods: [],
  });
  const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState({
    kind: "",
    faculty: "",
    period: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    score: "",
    fee: "",
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loadData = async (endpoint, key) => {
    try {
      const res = await APIs.get(endpoints[endpoint]);
      setData((prevState) => ({
        ...prevState,
        [key]: res.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${key}`, error);
    }
  };

  const loadActivityData = async () => {
    try {
      const res = await APIs.get(`${endpoints["admin_activities"]}/${id}`);
      setFormData({
        name: res.data.name,
        description: res.data.description,
        startDate: res.data.startDate,
        score: res.data.score,
        fee: res.data.money,
      });
      setSelected({
        kind: res.data.activityKind.id,
        faculty: res.data.faculty.id,
        period: res.data.period.id,
      });
    } catch (error) {
      console.error("Error fetching activity data", error);
    }
  };

  const handleChange = (event, key) => {
    setSelected((prevState) => ({
      ...prevState,
      [key]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const activityData = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      score: formData.score,
      money: formData.fee,
      activityKind: { id: selected.kind },
      faculty: { id: selected.faculty },
      period: { id: selected.period },
    };

    try {
      await APIs.put(`${endpoints["admin_activities"]}/${id}`, activityData);
      console.log("Activity Data:", activityData);
      alert("Activity updated successfully!");
      setErrors({});
    } catch (error) {
      if (error.response.data) {
        console.log(error.response.data);
        setErrors(error.response.data); // Set errors từ backend
      }
    }
  };

  useEffect(() => {
    loadData("kinds", "kinds");
    loadData("faculties", "faculties");
    loadData("periods", "periods");
    loadActivityData(); // Tải dữ liệu hoạt động khi component mount
  }, [id]);

  return (
    <>
      <h1 className="text-center text-success">Edit Activity</h1>
      <Form className="container" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Activity Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            onChange={handleFormChange}
            value={formData.name}
          />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description Activity</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Enter description"
            onChange={handleFormChange}
            value={formData.description}
          />
          {errors.description && (
            <p className="text-danger">{errors.description}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Enter Date"
            onChange={handleFormChange}
            value={formData.startDate}
            name="startDate"
          />
          {errors.startDate && (
            <p className="text-danger">{errors.startDate}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Score</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter score"
            onChange={handleFormChange}
            value={formData.score}
            name="score"
            min="0"
            step="1"
          />
          {errors.score && <p className="text-danger">{errors.score}</p>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kind</Form.Label>
          <Form.Select
            value={selected.kind}
            onChange={(e) => handleChange(e, "kind")}
          >
            <option value="">Select an option</option>
            {data.kinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                Kind {kind.id}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Faculty</Form.Label>
          <Form.Select
            value={selected.faculty}
            onChange={(e) => handleChange(e, "faculty")}
          >
            <option value="">Select an option</option>
            {data.faculties.map((f) => (
              <option key={f.id} value={f.id}>
                Faculty {f.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Period</Form.Label>
          <Form.Select
            value={selected.period}
            onChange={(e) => handleChange(e, "period")}
          >
            <option value="">Select an option</option>
            {data.periods.map((p) => (
              <option key={p.id} value={p.id}>
                Semester {p.semester} - Year {p.year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fee</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter fee to join activity"
            name="fee"
            value={formData.fee}
            onChange={handleFormChange}
            min="0"
            step="1"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default EditActivity;
