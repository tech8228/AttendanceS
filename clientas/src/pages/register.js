import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../service/api";
import { AuthContext } from "../helper/AuthContext";

function Registration() {
  const { authState } = useContext(AuthContext);

  const initialValues = {
    StudentName: "",
    email: "",
    //Password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4)
      .max(20)
      .matches(/^(?:[a-z0-9\s]*)$/gi, "Only lowercase letters and numbers")
      .required("Student Name required"),
    email: Yup.string().email("invaild email").required("email is required"),
  });

  let navi = useNavigate();

  const onSubmit = async (data) => {
    await axios.post(`${API_URL}/auth`, data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        if (authState) {
          navi("/");
        } else {
          navi("/login");
        }
      }
    });
  };

  return (
    <div className="outer">
      <h2>Student Registration</h2>
      <div className="card">
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="inner">
              <label>Student Name: </label>

              <Field name="username" />
            </div>
            <ErrorMessage name="username" component="span" />
            <div className="inner">
              <label>Email: </label>

              <Field name="email" />
            </div>
            <ErrorMessage name="email" component="span" />

            <div className="innerfile">
              <button type="submit"> Register</button>
              <button type="button" onClick={() => navi("/")}>
                Back
              </button>
              <button type="button" onClick={() => navi("/studentrecord")}>
                Check Attendance
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Registration;
