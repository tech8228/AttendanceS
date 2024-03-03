import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../service/api";

function Registration() {
  const initialValues = {
    StudentName: "",
    email: "",
    //Password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4)
      .max(20)
      .matches(/^(?:[a-z0-9]*)$/gi, "Only lowercase letters and numbers")
      .required("username required"),
    email: Yup.string().email("invaild email").required("email is required"),
  });

  let navi = useNavigate();

  const onSubmit = async (data) => {
    await axios.post(`${API_URL}/auth`, data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        navi("/login");
      }
    });
  };

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
              <label>Student Name: </label>

              <Field name="username" />
            </div>
            <ErrorMessage name="username" component="span" />
            <div className="inner">
              <label>Email: </label>

              <Field name="email" />
            </div>
            <ErrorMessage name="email" component="span" />
            {/* <div className="inner">
              <label>Password: </label>
              <ErrorMessage name="password" component="span" />
              <Field name="password" type="password" />
            </div> */}

            <div className="inner">
              <button type="submit"> Register</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Registration;
