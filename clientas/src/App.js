import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AuthContext } from "./helper/AuthContext";
import Home from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/register";
import Course from "./pages/course";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState(false);
        } else {
          setAuthState(true);
        }
      })
      .catch((error) => {
        console.error("AxiosError", error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState(false);
  };

  return (
    <div className="App">
      <div className="container-fluid bg-info">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            <div>
              <h1>Welcome to Student Attendance Sheet </h1>
            </div>
            <div className="navbar">
              <Link to="/">Home Page</Link>
              {authState ? (
                <>
                  {/* <Link to="/profile">Profile</Link>
                <Link to="/company">Company</Link> */}

                  <Link onClick={logout}>Logout</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Registration</Link>
                </>
              )}
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Course />} />

              {/* <Route path="/job/:id" element={<SingleJob />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/createJob" element={<CreateJob />} /> */}
              {/* <Route path="/createCompany" element={<CreateCompany />} /> */}
              {/* <Route path="/articles/byId/:id/update" element={<Update />} /> */}
              {/* <Route path="/articles/byId/:id/delete" element={<Delete />} /> */}
              {/* <Route path="/articles/byId/:id" element={<SingleItem />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
