import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addTask.css";
import axios from "axios";
import axiosClient from "../axiosClient";

const UpadateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { taskId } = useParams();

  const navigate = useNavigate();

  const getCurrent = async () => {
    const auth = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };

    try {
      const token = await axiosClient.get(`/user/getcurrentuser`, auth);

      if (!token) {
        console.log("no token  ");
        navigate("/login");
      }
      getTaskById();
    } catch (error) {
      console.log("error", error);
      navigate("/login");
    }
  };

  const getTaskById = async () => {
    try {
      const task = await axiosClient.get(`/task/get-task-by-id/${taskId}`);
      setTitle(task.data.title);
      setDescription(task.data.description);
      console.log("task : ", task);
    } catch (error) {
      console.log("error: ", error);
      toast.error(`somthing went wrong `);

      setTimeout(() => {
        useNavigate(`/`);
      }, 1500);
    }
  };

  useEffect(() => {
    console.log("taskId: ", taskId);
    getCurrent();
  }, [taskId]);

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
      const task = await axiosClient.post(`/task/update/${taskId}`, form);
      console.log("task : ", task);
      toast.success(`${title} updated`, {
        autoClose: 1500,
      });
    } catch (error) {
      console.log("error : ", error);
      if (error.response == 404) {
        toast.error(`Task Not Found`, {
          autoClose: 1500,
        });
      } else {
        toast.error(`Something went wrong`, {
          autoClose: 1500,
        });
      }
    }

    // Clear input fields after submission
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div class="card bg-info bg-gradient">
        <div class="card-body ">
          <h5 class="card-title  text-center fw-bolder">Update Task</h5>
          <div class="card-text">
            <form onSubmit={handleSubmit} className="neomorphic-form">
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Title:
                </label>
                <input type="text" className="form-control bg-light" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label  fw-semibold">
                  Description:
                </label>
                <textarea className="form-control bg-light" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Update Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpadateTask;
