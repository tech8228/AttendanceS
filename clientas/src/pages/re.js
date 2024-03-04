import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

  const navigateToSingle = (StudentID) => {
    if (StudentID) {
      navi(`/job/${StudentID}`, { state: { StudentNum: StudentID } });
    } else {
      console.error("Job ID is undefined or null");
    }
  };

  return (
    <div className="outer">
      {authState && (
        <div className="extra-controls">
          <div>
            <label>Select Course:</label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">--Select--</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Link className="btn btn-success" to="/create">
              Add Student
            </Link>
          </div>
          <button onClick={() => navi("/registerstudent")}>
            Register Student
          </button>
          <button onClick={() => navi("/course")}>Create Course</button>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Student Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="container-fluid bg-primary vh-100 vw-100">
        <h3>Students</h3>
        <div className="d-flex justify-content-end">
          <Link className="btn btn-success" to="/create">
            Add Student
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student ID </th>
              <th> Student Name</th>
              <th>Email</th>
              <th>Registration Date</th>

              <th>Actions</th>
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

                    <td>
                      <Link
                        className="btn mx-2 btn-success"
                        to={`/read/${student.studentID}`}
                      >
                        Read
                      </Link>
                      <Link
                        className="btn mx-2 btn-success"
                        to={`/edit/${student.studentID}`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(student.studentID)}
                        className="btn mx-2 btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
