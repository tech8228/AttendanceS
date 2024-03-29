import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";
import Select from "react-select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusOptions = [
  { value: "Present", label: "Present" },
  { value: "Late", label: "Late" },
  { value: "Absent", label: "Absent" },
  { value: "Leave Permitted", label: "Leave Permitted" },
];

function HomeAttendance() {
  const [listOfStudents, setListOfStudents] = useState([]);

  const { authState } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [courses, setListCourses] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/attend/courses`);
        setListCourses(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (RecordID, selectedValue) => {
    try {
      let currentDate;
      if (selectedDate) {
        const date = new Date(selectedDate);
        date.setHours(date.getHours() + 5);
        currentDate = date.toLocaleDateString();
      } else {
        currentDate = new Date().toLocaleDateString();
      }

      //const method = selectedDate ? "PUT" : "POST";

      //if (method === "PUT") {
      // Use PUT request if datepicker was selected
      await axios.put(`${API_URL}/attend/update/${RecordID}`, {
        Status: selectedValue,
        Date: currentDate,
      });
      // } else {
      //   // Use POST request if datepicker was not selected
      //   await axios.post(`${API_URL}/attend/update/${RecordID}`, {
      //     Status: selectedValue,
      //     Date: currentDate,
      //   });
      // }
    } catch (error) {
      console.error(`Error updating attendance for  ${RecordID}`, error);
    }
  };

  const handleGetAttendance = async () => {
    let requestData = { courseId: selectedOption };

    if (selectedDate) {
      const dateOnly = selectedDate.split("T")[0];
      requestData.date = dateOnly;
    }

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
      <h2>
        Attendance for Date: {"  "}
        <span style={{ color: "Green" }}>
          {selectedDate ? selectedDate : new Date().toLocaleDateString()}{" "}
        </span>
      </h2>
      <div
        style={{
          padding: "20px",
          width: "25%",
        }}
      >
        <Pie data={data} options={options}></Pie>
      </div>
      {authState && (
        <div>
          <p></p>
          <div className="innerfile right">
            {/* <button onClick={() => navi("/assign")}>Course Assignment</button>
            <button onClick={() => navi("/register")}>Student</button>
            <button onClick={() => navi("/courses")}>Course</button> */}
          </div>
          <p></p>
          <div></div>
          <div className="extra-controls">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="innerfile">
              <label>Select Course:</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">--Select--</option>
                {courses.map((course) => (
                  <option key={course.courseID} value={course.courseID}>
                    {course.CourseName}
                  </option>
                ))}
              </select>

              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button onClick={handleGetAttendance}>Get Attendance</button>
            </div>
            <p>{error && <p style={{ color: "red" }}>{error}</p>}</p>
          </div>
        </div>
      )}

      <div className="container-fluid bg-info vh-100 vw-100">
        <h3>Students</h3>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th> Student Id</th>
                <th>Student Name</th>
                <th> Attendance Date</th>
                <th>Status</th>
                <th>New Status</th>
              </tr>
            </thead>
            <tbody>
              {listAttendance.map((Record) => {
                return (
                  <tr key={Record.RecordID}>
                    <td>{Record.StudentID}</td>
                    <td>{Record.StudentName}</td>
                    <td>
                      {Record.AttendanceDate
                        ? Record.AttendanceDate.split("T")[0]
                        : "N/A"}
                    </td>
                    <td>{Record.Status}</td>
                    <td>
                      <select
                        value={Record.label} // Set the selected value
                        onChange={(e) =>
                          handleStatusChange(Record.RecordID, e.target.value)
                        } // Handle status change
                      >
                        <option value="">Select Status</option>
                        {StatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomeAttendance;
