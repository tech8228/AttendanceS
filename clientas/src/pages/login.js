import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import API_URL from "../service/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthState } = useContext(AuthContext);
  //const { userlogged, setUserloggeg } = useLocalStorage("IdUser", null);

  let navi = useNavigate();

  const login = () => {
    const data = { Studentname: username, password: password };
    axios
      .post(`${API_URL}/auth/login`, data)
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          console.log(response.data);
          localStorage.setItem("accessToken", response.data);
          setAuthState(true);
          navi("/");
        }
      })
      .catch((error) => {
        setError(error.response.data.error);
        console.error("Error logging in:", error);
      });
  };
  return (
    <div className="outer">
      <div className="card">
        {error && (
          <div className="inner" style={{ color: "red" }}>
            {error}
          </div>
        )}
        <div className="inner">
          <label>Username: </label>
          <input
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="inner">
          <label>Password: </label>
          <input
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>

        <div className="innerfile">
          <button onClick={login}> Login</button>
        </div>
        <div>
          <label className="loginRegisterButton">
            <Link to="/register">Student Registration </Link>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Login;
