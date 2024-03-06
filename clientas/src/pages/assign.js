import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";

function Home() {
  const { authState } = useContext(AuthContext);
  const [listOfStudents, setListOfStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [courses, setListCourses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  let navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/assign/courses`);
        setListCourses(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/assign/student`);
        setListOfStudents(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAssignCourse = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (selectedCourse && selectedStudent) {
      try {
        await axios.post(
          `${API_URL}/assign/attendance`,
          {
            courseID: selectedCourse,
            studentID: selectedStudent,
          },
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );

        setSuccess("Course has been assigned to the student.");
        setError("");
      } catch (error) {
        console.error("Error assigning course:", error);
        setError(error.response.data.message || "Error assigning course");
        setSuccess("");
      }
    } else {
      setError("Please select both a course and a student.");
      setSuccess("");
    }
  };

  return (
    <div className="outer">
      <p></p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {authState && (
        <div className="extra-controls">
          <div className="innerfile">
            <form onSubmit={handleAssignCourse}>
              <label>Select Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">--Select--</option>
                {courses.map((course) => (
                  <option key={course.courseID} value={course.courseID}>
                    {course.CourseName}
                  </option>
                ))}
              </select>
              <label>Select Student:</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">--Select--</option>
                {listOfStudents.map((student) => (
                  <option key={student.studentID} value={student.studentID}>
                    {student.StudentName}
                  </option>
                ))}
              </select>
              <button type="submit">Assign Course</button>
              <button type="button" onClick={() => navi("/")}>
                Back
              </button>{" "}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
