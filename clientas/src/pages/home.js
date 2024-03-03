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
                <option key={courses.courseId} value={courses.courseId}>
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
      {searchResults &&
        searchResults.map((value) => {
          return (
            <div
              className="card"
              onClick={() => navigateToSingle(value.StudentId)}
              key={value.StudentId}
            >
              <div className="inner">
                <label> Student Name: </label>
                <h2 className="title">{value.StudentName}</h2>
              </div>

              <div className="inner">
                <label> Job Location: </label>
                <label>{value.email}</label>
              </div>
              <div className="inner">
                <p className="date">
                  Registered Date: {value.RegistrationDate.split("T")[0]}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Home;
