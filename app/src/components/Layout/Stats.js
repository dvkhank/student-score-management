/* eslint-disable */
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import APIs, { endpoints } from "../../configs/APIs";
import SideNav from "./SideNav";
import AdminHeader from "./AdminHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Stats() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [StatsByFaculty, setStatsByFaculty] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [statsByClass, setStatsByClass] = useState([]);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(endpoints["faculties"]);
      setFaculties(res.data);
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };

  const handleOnclickFaculty = async (event) => {
    event.preventDefault();
    await loadStatsByFaculty();
  };
  const handleOnclickClass = async (event) => {
    event.preventDefault();
    await loadStatsByClass();
  };
  const handlePeriodChange = (event) => {
    const periodId = event.target.value;
    setSelectedPeriod(periodId);
  };
  const handleFacultyChange = (event) => {
    const facultyId = event.target.value;
    setSelectedFaculty(facultyId);
  };
  const handleAchievementChange = (event) => {
    const achievement = event.target.value;
    setSelectedAchievement(achievement);
  };

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(endpoints["periods"]);
      setPeriods(res.data);
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };
  const loadStatsByFaculty = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(
        `${endpoints["stats_by_faculty"]}?periodId=${selectedPeriod}&achievement=${selectedAchievement}`
      );
      setStatsByFaculty(res.data);
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };
  const loadStatsByClass = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(
        `${endpoints["stats_by_class"]}?periodId=${selectedPeriod}&facultyId=${selectedFaculty}&achievement=${selectedAchievement}`
      );
      setStatsByClass(res.data);
    } catch {
      console.log("Loi roi");
    } finally {
      setLoading(false);
    }
  };

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartDataByFaculty = {
    labels: StatsByFaculty.map((item) => item[0]) || [], // Labels từ danh sách
    datasets: [
      {
        label: "Số lượng",
        data: StatsByFaculty.map((item) => item[1]) || [], // Dữ liệu từ danh sách
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const chartDataByClass = {
    labels: statsByClass.map((item) => item[0]) || [], // Labels từ danh sách
    datasets: [
      {
        label: "Số lượng",
        data: StatsByFaculty.map((item) => item[1]) || [], // Dữ liệu từ danh sách
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê theo khoa",
      },
    },
  };
  useEffect(() => {
    loadPeriods();
    loadFaculty();
  }, []);

  return (
    <>
      <SideNav></SideNav>
      <AdminHeader></AdminHeader>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid"></div>
        </div>
        <section className="content">
          <div className="container-fluid">
            {/* /.row */}
            {/* Main row */}
            <div className="row">
              <div className="container text-center">
                <div className="row">
                  <h1 className="text-success">STATISTICS BY FACULTY</h1>
                  <div className="col-md-5 col-12">
                    <Form>
                      <div className="form-floating">
                        <Form.Group>
                          <Form.Label htmlFor="period-select">
                            Choose an achievement
                          </Form.Label>
                          <Form.Select
                            value={selectedAchievement}
                            onChange={handleAchievementChange}
                            className="text-center"
                          >
                            <option value="">
                              -- Choose an achievement --
                            </option>
                            <option value="excellent">Xuất sắc</option>
                            <option value="verygood">Giỏi</option>
                            <option value="good">Khá</option>
                            <option value="average">Trung bình</option>
                            <option value="belowaverage">Yếu</option>
                            <option value="weak">Kém</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="form-floating">
                        <Form.Group>
                          <Form.Label htmlFor="period-select">
                            Choose a period:
                          </Form.Label>
                          <Form.Select
                            id="period-select"
                            value={selectedPeriod}
                            onChange={handlePeriodChange}
                            className="text-center"
                          >
                            <option value="">-- Choose a period --</option>
                            {/* Bước 3: Hiển thị các options từ periods */}
                            {periods.map((period) => (
                              <option key={period.id} value={period.id}>
                                Semester: {period.semester} - Year:{" "}
                                {period.year}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="form-floating mb-3 mt-3">
                        <Button
                          onClick={handleOnclickFaculty}
                          className="btn btn-success"
                        >
                          Lọc
                        </Button>
                      </div>
                    </Form>
                    <table className="table" id="data-table1">
                      <thead>
                        <tr>
                          <th>Khoa</th>
                          <th>Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {StatsByFaculty.map((s) => (
                          <tr>
                            <td>{s[0]}</td>
                            <td>{s[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-7 col-12">
                    <Bar data={chartDataByFaculty} options={chartOptions} />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <h1 className="text-success">STATISTICS BY CLASS</h1>
                  <div className="col-md-5 col-12">
                    <Form>
                      <div className="form-floating">
                        <Form.Group>
                          <Form.Label htmlFor="period-select">
                            Choose an achievement
                          </Form.Label>
                          <Form.Select
                            value={selectedAchievement}
                            onChange={handleAchievementChange}
                            className="text-center"
                          >
                            <option value="">
                              -- Choose an achievement --
                            </option>
                            <option value="excellent">Xuất sắc</option>
                            <option value="verygood">Giỏi</option>
                            <option value="good">Khá</option>
                            <option value="average">Trung bình</option>
                            <option value="belowaverage">Yếu</option>
                            <option value="weak">Kém</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="form-floating">
                        <Form.Group>
                          <Form.Label htmlFor="period-select">
                            Choose a period:
                          </Form.Label>
                          <Form.Select
                            id="period-select"
                            value={selectedPeriod}
                            onChange={handlePeriodChange}
                            className="text-center"
                          >
                            <option value="">-- Choose a period --</option>
                            {/* Bước 3: Hiển thị các options từ periods */}
                            {periods.map((period) => (
                              <option key={period.id} value={period.id}>
                                Semester: {period.semester} - Year:{" "}
                                {period.year}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="form-floating">
                        <Form.Group>
                          <Form.Label htmlFor="period-select">
                            Choose a faculty:
                          </Form.Label>
                          <Form.Select
                            id="faculty-select"
                            value={selectedFaculty}
                            onChange={handleFacultyChange}
                            className="text-center"
                          >
                            <option value="">-- Choose a faculty --</option>
                            {/* Bước 3: Hiển thị các options từ periods */}
                            {faculties.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                      <div className="form-floating mb-3 mt-3">
                        <Button
                          onClick={handleOnclickClass}
                          className="btn btn-success"
                        >
                          Lọc
                        </Button>
                      </div>
                    </Form>
                    <table className="table" id="data-table1">
                      <thead>
                        <tr>
                          <th>Khoa</th>
                          <th>Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsByClass.map((s) => (
                          <tr>
                            <td>{s[0]}</td>
                            <td>{s[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-7 col-12">
                    <Bar data={chartDataByClass} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
export default Stats;
