import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useHistory } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";

function Registration() {
  const { authState } = useContext(AuthContext);
  const [listCourses, setListCourses] = useState([]);
  const [deleted, setDeleted] = useState(true);

  const initialValues = {
    CourseName: "",
  };

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

  const validationSchema = Yup.object().shape({
    CourseName: Yup.string()
      .min(3)

      .matches(/^(?:[a-zA-Z0-9]*)$/gi, "Only letters and numbers")
      .required("Course Name is required"),
  });

  let navi = useNavigate();

  const onSubmit = async (data) => {
    await axios.post(`${API_URL}/courses`, data).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        navi("/homeattendance");
      }
    });
  };

  useEffect(() => {
    if (deleted) {
      setDeleted(false);
      axios
        .get(`${API_URL}/courses`)
        .then((res) => {
          setListCourses(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [deleted]);

  function handleUpdate(id) {}

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/courses/delete/${id}`)
        .then((res) => {
          setDeleted(true);
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className="outer">
      <div className="card">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="inner">
              <label>Course Name: </label>

              <Field name="CourseName" />
            </div>
            <ErrorMessage name="CourseName" component="span" />
            <div className="innerfile">
              {authState && <button type="submit"> Add </button>}

              <button type="button" onClick={() => navi("/")}>
                Back
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Course ID </th>
              <th> Course Name</th>
              {authState && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {listCourses.map((course) => {
              return (
                <tr>
                  <td>{course.courseID}</td>
                  <td>{course.CourseName}</td>
                  {authState && (
                    <td>
                      <button
                        className="btn mx-2 btn-danger"
                        onClick={() => handleDelete(course.courseID)}
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
  );
}

export default Registration;
