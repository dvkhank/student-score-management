import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";

const Activity = () => {
  const [kinds, setKinds] = useState([]);
  const [selectedKind, setSelectedKind] = useState("");
  const loadKinds = async () => {
    try {
      const res = await APIs.get(endpoints["kinds"]);
      setKinds(res.data);
    } catch (error) {
      console.error("Error fetching kinds", error);
    }
  };

  // Hàm xử lý thay đổi lựa chọn
  const handleKindChange = (event) => {
    setSelectedKind(event.target.value);
  };

  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const loadFaculties = async () => {
    try {
      const res = await APIs.get(endpoints["faculties"]);
      setFaculties(res.data);
    } catch (error) {
      console.error("Error fetching kinds", error);
    }
  };
  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
  };

  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const loadPeriods = async () => {
    try {
      const res = await APIs.get(endpoints["periods"]);
      setPeriods(res.data);
    } catch (error) {
      console.error("Error fetching kinds", error);
    }
  };
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  useEffect(() => {
    loadKinds();
    loadFaculties();
    loadPeriods();
  }, []);
  return (
    <>
      <h1 className="text-center text-success">Create an activity</h1>
      <Form className="container">
        <Form.Group className="mb-3">
          <Form.Label>Activity Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description Activity</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group className="mb-3" c>
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="date" placeholder="Enter Date" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Score</Form.Label>
          <Form.Control type="number" placeholder="Enter score" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kind</Form.Label>
          <Form.Select value={selectedKind} onChange={handleKindChange}>
            <option value="">Select an option</option>
            {kinds.map((kind) => (
              <option key={kind.id} value={kind.id}>
                Kind {kind.id}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Faculty</Form.Label>
          <Form.Select value={selectedFaculty} onChange={handleFacultyChange}>
            <option value="">Select an option</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                Faculty {f.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Period</Form.Label>
          <Form.Select value={selectedPeriod} onChange={handlePeriodChange}>
            <option value="">Select an option</option>
            {periods.map((p) => (
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
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};
export default Activity;
