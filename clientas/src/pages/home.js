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
  const [deleted, setDeleted] = useState(true);

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

  function handleUpdate(id) {
    navi(`/registerstudent/${id}`);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete Student with ID : {id}?"
    );
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/student/delete/${id}`)
        .then((res) => {
          setDeleted(true);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="outer ">
      {authState && (
        <div>
          <p></p>
          <div className="innerfile right">
            <button onClick={() => navi("/assign")}>Course Assignment</button>
            <button onClick={() => navi("/register")}>Add Student</button>
            <button onClick={() => navi("/courses")}>Add Course</button>
          </div>
          <p></p>
          <div></div>
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
                {authState && <th>Actions </th>}
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
                      {authState && (
                        <td>
                          <button
                            className="btn mx-2 btn-info"
                            onClick={() => handleUpdate(student.studentID)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn mx-2 btn-danger"
                            onClick={() => handleDelete(student.studentID)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
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
