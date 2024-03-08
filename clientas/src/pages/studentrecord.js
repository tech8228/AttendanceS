import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";
import Select from "react-select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function StudentRecord() {
  const [listOfStudents, setListOfStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { authState } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("");

  const [listAttendance, setListAttendance] = useState([]);
  const [error, setError] = useState("");
  const [statusData, setStatusData] = useState([]);

  const [statusList, setStatusList] = useState([]);

  const options = {};

  let navi = useNavigate();

  useEffect(() => {
    setStatusList(
      listAttendance.map((record) => ({
        value: record.Status,
        label: record.Status,
      }))
    );
  }, [listAttendance]);

  const handleGetAttendance = async () => {
    let requestData = { courseId: selectedOption };

    try {
      const response = await axios.get(`${API_URL}/attend/attendance`, {
        params: requestData,
      });
      setListAttendance(response.data);
      const attendanceData = response.data.map((record) => ({
        StudentID: record.StudentID,
        Status: record.Status,
      }));

      setStatusList(attendanceData);

      let presentCount = 0;
      let lateCount = 0;
      let absentCount = 0;
      let permittedCount = 0;
      let nullCount = 0;

      response.data.forEach((checkStatus) => {
        switch (checkStatus.Status) {
          case "Present":
            presentCount++;
            break;
          case "Late":
            lateCount++;
            break;
          case "Absent":
            absentCount++;
            break;
          case "Permitted":
            permittedCount++;
            break;
          default:
            nullCount++;
            break;
        }
      });

      const statusData = [
        presentCount,
        lateCount,
        absentCount,
        permittedCount,
        nullCount,
      ];

      setStatusData(statusData);
      // Set the extracted data to the statusList state

      // Handle the response data as needed
      console.log("Attendance data:", response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/search?sname=${searchTerm}`);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSearchResults(response.data);
        setError("");

        let presentCount = 0;
        let lateCount = 0;
        let absentCount = 0;
        let permittedCount = 0;
        let nullCount = 0;

        response.data.forEach((checkStatus) => {
          switch (checkStatus.Status) {
            case "Present":
              presentCount++;
              break;
            case "Late":
              lateCount++;
              break;
            case "Absent":
              absentCount++;
              break;
            case "Permitted":
              permittedCount++;
              break;
            default:
              nullCount++;
              break;
          }
        });

        const statusData = [
          presentCount,
          lateCount,
          absentCount,
          permittedCount,
          nullCount,
        ];

        setStatusData(statusData);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No students found");
        setStatusData(0);
      } else {
        console.error("Error fetching search results:", error);
        setError("An error occurred while fetching data");
      }
    }
  };

  const data = {
    labels: ["Present", "Late", "Absent", "Leave Permitted", "Not Registered"],
    datasets: [
      {
        data: statusData,
        backgroundColor: ["aqua", "orangered", "purple", "brown", "lightgreen"],
      },
    ],
  };

  return (
    <div className="outer ">
      <div
        style={{
          padding: "20px",
          width: "25%",
        }}
      >
        <Pie data={data} options={options}></Pie>
      </div>
      <div className="rounded">
        <input
          type="text"
          placeholder="Student Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "5px" }}
        />
        <button className="rounded" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="container-fluid bg-info vh-100 vw-100">
        <h3>Students</h3>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th> Attendance Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((Record) => {
                  return (
                    <tr key={Record.StudentID}>
                      <td>{Record.CourseName}</td>

                      <td>
                        {Record.AttendanceDate
                          ? Record.AttendanceDate.split("T")[0]
                          : "N/A"}
                      </td>

                      <td>{Record.Status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentRecord;
