import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import axiosClient from "../axiosClient";

const Login = () => {
  /*  const [email, setEmail] = useState("rahre49@gmail.com");
  const [password, setPassword] = useState("111111"); */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getCurrent = async () => {
    const auth = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    try {
      const token = await axiosClient.get(`/user/getcurrentuser`, auth);

      if (token) {
        console.log("token : ", token);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getCurrent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("Email and password are required", {
        autoClose: 1500,
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", {
        autoClose: 1500,
      });
      return;
    }

    // Form data
    const formData = {
      email: email,
      password: password,
    };

    try {
      // Make API call to login user
      const response = await axiosClient.post("/user/login", formData);
      console.log("result : ", response);
      // Display success message
      toast.success("Login successful", {
        autoClose: 1500,
      });
      localStorage.setItem("token", response.data.token);

      // Clear input fields after successful login
      setEmail("");
      setPassword("");

      // Redirect to dashboard or desired route
      navigate("/");
    } catch (error) {
      // Display error message if login fails
      toast.error("Login failed. Please try again later.", {
        autoClose: 1500,
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card bg-info bg-gradient">
        <div className="card-body">
          <h5 className="card-title text-center">Login</h5>
          <div className="card-text">
            <form onSubmit={handleSubmit} className="neomorphic-form">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input type="email" className="form-control bg-light" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                </label>
                <input type="password" className="form-control bg-light" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <Link to="/register">Don't Have an Account</Link>
              </div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
