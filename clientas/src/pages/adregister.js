import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link, useHistory } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";

function Home() {
  const [listOfStudents, setListOfStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { authState } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [courses, setListCourses] = useState([]);

  let navi = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
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
        const response = await axios.get(`${API_URL}/`);
        setListOfStudents(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter jobs based on search term
    const filteredStudents = (listOfStudents || []).filter((student) =>
      student.StudentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredStudents);
  }, [searchTerm, listOfStudents]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/student/search?title=${searchTerm}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="outer ">
      {authState && (
        <div>
          <p></p>
          <div className="innerfile right">
            <button onClick={() => navi("/assign")}>Course Assignment</button>
            <button onClick={() => navi("/register")}>Student</button>
            <button onClick={() => navi("/courses")}>Course</button>
          </div>
          <p></p>
          <div></div>
          <div className="extra-controls">
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
              <button onClick={() => navi("/register")}>Get Attendance</button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid bg-info vh-100 vw-100">
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
        <h3>Students</h3>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Student ID </th>
                <th> Student Name</th>
                <th>Email</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {searchResults &&
                searchResults.map((student) => {
                  return (
                    <tr>
                      <td>{student.studentID}</td>
                      <td>{student.StudentName}</td>
                      <td>{student.email}</td>
                      <td>{student.RegistrationDate.split("T")[0]}</td>
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

export default Home;
