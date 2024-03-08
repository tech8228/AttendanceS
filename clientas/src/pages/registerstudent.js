import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../service/api";

function RegisterStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState(null); // Initialize as null initially

  useEffect(() => {
    if (id) {
      const fetchStudentDetails = async () => {
        try {
          const response = await axios.get(`${API_URL}/student/${id}`);
          setStudent(response.data);
        } catch (error) {
          console.error("Error fetching student details:", error);
        }
      };
      fetchStudentDetails();
    }
  }, [id]);

  const initialValues = {
    studentID: student?.studentID || "", // Use optional chaining to prevent errors if student is null
    StudentName: student?.StudentName || "",
    email: student?.email || "",
    RegistrationDate: student?.RegistrationDate.split("T")[0] || "",
  };

  const validationSchema = Yup.object().shape({
    StudentName: Yup.string()
      .min(4)
      .max(20)
      .matches(/^(?:[a-z0-9\s]*)$/gi, "Only lowercase letters and numbers")
      .required("Student Name required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  let navi = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.put(`${API_URL}/student/${id}`, data);
      navi("/");
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  return (
    <div className="outer">
      <div className="card">
        {student && (
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <div className="inner">
                <label>Student ID: </label>
                <Field name="studentID" type="text" disabled />
              </div>
              <div className="inner">
                <label>Student Name: </label>
                <Field name="StudentName" type="text" />
              </div>
              <div className="inner">
                <label>Email: </label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component="span" />
              </div>
              <div className="inner">
                <label>Registration Date: </label>
                <Field name="RegistrationDate" type="text" disabled />
              </div>
              <div className="innerfile right">
                <button type="submit">Update</button>
                <button onClick={() => navi("/")}>Back</button>
              </div>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
}

export default RegisterStudent;
