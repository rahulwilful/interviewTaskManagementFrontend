import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addTask.css";
import axios from "axios";
import axiosClient from "../axiosClient";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const getCurrent = async () => {
    const auth = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    try {
      const token = await axiosClient.get(`/user/getcurrentuser`, auth);
      console.log(token);
      const id = token.data.data._id;
      setUserId(id);
      console.log(" userId: ", id);

      if (!token) {
        console.log("no token  ");
        navigate("/login");
      }
    } catch (error) {
      console.log("error", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getCurrent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can add code to submit the task to your backend or perform any other action
    if (title == "") {
      toast.error("enter valid title", {
        autoClose: 1500,
      });
    }
    if (description == "") {
      toast.error("enter valid description", {
        autoClose: 1500,
      });
    }
    const form = {
      title: title,
      description: description,
    };
    try {
      const task = await axiosClient.post(`/task/add/${userId}`, form);
      console.log("task : ", task);
      toast.success(`${title} added`, {
        autoClose: 1500,
      });
    } catch (error) {
      console.log("error : ", error);
      toast.error(`Something went wrong`, {
        autoClose: 1500,
      });
    }

    // Clear input fields after submission

    setTitle("");
    setDescription("");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card bg-info bg-gradient">
        <div className="card-body ">
          <h5 className="card-title  text-center">Add Task</h5>
          <div className="card-text">
            <form onSubmit={handleSubmit} className="neomorphic-form">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title:
                </label>
                <input type="text" className="form-control bg-light" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description:
                </label>
                <textarea className="form-control bg-light" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
