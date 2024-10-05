import React, { useEffect, useState } from "react";
import SideNav from "../Layout/SideNav";
import StudentHeader from "../Layout/StudentHeader";
import APIs, { endpoints } from "../../configs/APIs";
import { useUser } from "../Auth/UserContext";
import MySprinner from "../Commons/MySprinner";
import { Form, Navbar, Table, Container } from "react-bootstrap";

function ScoreDetails() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const { userInfo } = useUser();
  const [periods, setPeriods] = useState([]);
  const [listScoreByKind, setListScoreByKind] = useState([]);
  const [activitiesKind, setActivitiesKind] = useState([]);

  const loadActivitiesKind = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(
        `${endpoints["activities_by_kind"]}?userId=${userInfo.userId}&periodId=${selectedPeriod}`,
        {
          headers: {
            Authorization: userInfo.token, // Thêm token vào header
          },
        }
      );
      setActivitiesKind(res.data);
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
  const scoreByKind = async () => {
    try {
      setLoading(true);
      const res = await APIs.get(
        `${endpoints["score_by_kind"]}?userId=${userInfo.userId}&periodId=${selectedPeriod}`,
        {
          headers: {
            Authorization: userInfo.token, // Thêm token vào header
          },
        }
      );
      setListScoreByKind(res.data);
      console.log(res.data);
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
    scoreByKind();
    loadActivitiesKind();
  }, [selectedPeriod]);
  const handlePeriodChange = (event) => {
    const periodId = event.target.value;
    setSelectedPeriod(periodId);
  };
  return (
    <>
      <SideNav />
      <StudentHeader />
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
                  <div className="container">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Details</th>
                          <th className="text-center">Total Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listScoreByKind.map((score) => (
                          <React.Fragment key={score[0]}>
                            <tr>
                              <td className="font-weight-bold">
                                Kind {score[0]}: {score[1]}
                              </td>
                              <td className="text-center">
                                {score[3]} / {score[2]}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="1">
                                <Table bordered hover>
                                  <thead>
                                    <tr className="text-center">
                                      <th>Activity Name</th>
                                      <th>Score</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {score[0] === 1 &&
                                      activitiesKind
                                        .filter((activity) => activity[2] === 1) // Lọc hoạt động có loại là 1
                                        .map((activity, index) => (
                                          <tr
                                            className="text-center"
                                            key={index}
                                          >
                                            <td>{activity[0]}</td>
                                            <td>{activity[1]}</td>
                                          </tr>
                                        ))}

                                    {score[0] === 2 &&
                                      activitiesKind
                                        .filter((activity) => activity[2] === 2) // Lọc hoạt động có loại là 2
                                        .map((activity, index) => (
                                          <tr
                                            className="text-center"
                                            key={index}
                                          >
                                            <td>{activity[0]}</td>
                                            <td>{activity[1]}</td>
                                          </tr>
                                        ))}

                                    {score[0] === 3 &&
                                      activitiesKind
                                        .filter((activity) => activity[2] === 3) // Lọc hoạt động có loại là 3
                                        .map((activity, index) => (
                                          <tr
                                            className="text-center"
                                            key={index}
                                          >
                                            <td>{activity[0]}</td>
                                            <td>{activity[1]}</td>
                                          </tr>
                                        ))}

                                    {score[0] === 4 &&
                                      activitiesKind
                                        .filter((activity) => activity[2] === 4) // Lọc hoạt động có loại là 4
                                        .map((activity, index) => (
                                          <tr
                                            className="text-center"
                                            key={index}
                                          >
                                            <td>{activity[0]}</td>
                                            <td>{activity[1]}</td>
                                          </tr>
                                        ))}

                                    {score[0] === 5 &&
                                      activitiesKind
                                        .filter((activity) => activity[2] === 5) // Lọc hoạt động có loại là 5
                                        .map((activity, index) => (
                                          <tr
                                            className="text-center"
                                            key={index}
                                          >
                                            <td>{activity[0]}</td>
                                            <td>{activity[1]}</td>
                                          </tr>
                                        ))}

                                    {activitiesKind.length === 0 && (
                                      <tr>
                                        <td colSpan="2">No activities</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                        <tr>
                          <td className="font-weight-bold">Total</td>
                          <td className="text-center font-weight-bold">
                            {listScoreByKind.reduce(
                              (total, score) => total + score[3],
                              0
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
export default ScoreDetails;
