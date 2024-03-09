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
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredStatusList, setFilteredStatusList] = useState([]);

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

  useEffect(() => {
    // Filter status list based on selected course
    if (selectedCourse) {
      console.log("Selected course:", selectedCourse);
      const filteredList = statusList.filter(
        (item) => item.CourseName === selectedCourse.value
      );
      console.log("Filtered list:", filteredList);
      setFilteredStatusList(filteredList);
    } else {
      setFilteredStatusList([]);
    }
  }, [selectedCourse, statusList]);

  const handleSearch = async () => {
    try {
      setFilteredStatusList([]);

      const response = await axios.get(`${API_URL}/search?sname=${searchTerm}`);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSearchResults(response.data);
        setError("");

        const statusData = response.data.map((record) => ({
          CourseName: record.CourseName,
          StudentID: record.StudentID,
          AttendanceDate: record.AttendanceDate,
          Status: record.Status,
        }));

        setStatusList(statusData);

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
            case "Leave Permitted":
              permittedCount++;
              break;
            default:
              nullCount++;
              break;
          }
        });

        const statusChartData = [
          presentCount,
          lateCount,
          absentCount,
          permittedCount,
          nullCount,
        ];

        setStatusData(statusChartData);
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

  const handleCourseSelect = (selectedCourse) => {
    setSelectedCourse(selectedCourse);
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

  // Extract unique course names from statusList
  const uniqueCourseNames = [
    ...new Set(statusList.map((item) => item.CourseName)),
  ];

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

      <div className="rounded">
        <Select
          options={[
            { value: "", label: "Select Course" },
            ...uniqueCourseNames.map((course) => ({
              value: course,
              label: course,
            })),
          ]}
          onChange={handleCourseSelect}
          placeholder="Select Course"
        />
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
                {filteredStatusList.map((Record) => {
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
