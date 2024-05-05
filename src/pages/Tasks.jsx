import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Tasks.css";
import axios from "axios";
import axiosClient from "../axiosClient.js";
import Navbar from "../components/Navbar.jsx";
const Tasks = () => {
  const [displayTask, setDisplayTask] = useState([]);
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]); // State variable to store tasks
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
      console.log(" token: ", token);
      const id = token.data.data._id;
      setUserId(id);
      console.log(" userId: ", userId);
      if (!token) {
        console.log("token : ");
        navigate("/login");
      }

      getAllTasks();
    } catch (error) {
      console.log("error", error);
      navigate("/login");
    }
  };
  useEffect(() => {
    getCurrent();
  }, [userId]);

  const getAllTasks = async () => {
    try {
      const response = await axiosClient.get(`/task/get-all-tasks/${userId}`);
      setTasks(response.data);
      setDisplayTask(response.data);
      // Update tasks state with fetched data
      console.log("All Tasks  : ", displayTask);
      console.log("response  : ", response);
    } catch (error) {
      toast.error(`Something went `, {
        autoClose: 1500,
      });
      console.log("error : ", error);
    }
  };

  const handleUpdateTask = (id) => {
    console.log("id : ", id);
    navigate(`/update-task/${id}`);
  };

  const changeStatus = async (id, status) => {
    console.log("id : ", id, " status : ", status);

    if (status == "started") {
      status = "pending";
    } else if (status == "completed") {
      status = "pending";
    } else {
      status = "completed";
    }
    const form = {
      status: status,
    };
    try {
      const response = await axiosClient.post(`/task/change-status/${id}`, form);
      let newTasks = [...tasks];
      for (let i in newTasks) {
        if (newTasks[i]._id == id) {
          newTasks[i].status = status;
          console.log(newTasks[i]);
          break;
        }
      }

      setTasks(newTasks);
      toast.success(`status changed to ${response.data.status}`, {
        autoClose: 1500,
        position: "top-center",
      });
    } catch (error) {
      console.log("error : ", error);
      toast.error(`something went wrong`, {
        autoClose: 1500,
      });
    }
  };

  const handleAddTask = () => {
    navigate("/add");
  };

  const deleteTask = async (id) => {
    console.log("id : ", id);
    try {
      const response = await axiosClient.delete(`/task/delete/${id}`);
      console.log(response);
      toast.success(`Task deleted`, {
        autoClose: 1500,
        position: "top-left",
      });
      const deletedTask = tasks.filter((task) => task._id != id);
      setDisplayTask(deletedTask);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleAllTasks = () => {
    console.log("handleAllTasks");
    const allTasks = tasks;
    setDisplayTask(allTasks);
  };
  const handleFilterPending = () => {
    console.log("handleFilterPending");
    const pendingTasks = tasks.filter((task) => task.status == "pending");
    setDisplayTask(pendingTasks);
  };
  const handleFilterCompleted = () => {
    console.log("handleFilterCompleted");
    const completedTasks = tasks.filter((task) => task.status == "completed");
    setDisplayTask(completedTasks);
  };

  console.log("tasks2", tasks);

  const handleSearch = (event) => {
    console.log("handleSearch called");
    const searchTerm = event.target.value.toLowerCase();
    const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm));
    setDisplayTask(filteredTasks);
  };

  return (
    <div className="container  vh-100 w-100">
      <div className="container d-flex justify-content-center align-items-center  w-100">
        <div className=" w-100">
          <h1 className="text-center my-4">Task Management</h1>

          <div className="w-100">
            <div className="w-100 d-flex position-relative">
              <div>
                <input className="form-control me-2" type="search" onChange={(e) => handleSearch(e)} placeholder="Search" aria-label="Search" />
              </div>
              <button type="button" onClick={() => handleAllTasks()} className="btn bg-light border bg-gradient mx-3 fw-bolder   text-dark ">
                All Tasks
              </button>
              <button type="button" onClick={() => handleFilterPending()} className="btn bg-danger bg-gradient mx-3 fw-bolder   text-light">
                Pending
              </button>
              <button type="button" onClick={() => handleFilterCompleted()} className="btn bg-dark bg-gradient mx-3  fw-bolder text-light">
                Completed
              </button>
              <button type="button" onClick={() => handleAddTask()} className="btn btn-primary mx-3 position-absolute end-0   fw-bolder text-light float-end">
                Add Task
              </button>
            </div>
          </div>

          <ul className="list-group ">
            {displayTask.map((task) => (
              //list-group-item  my-2 shadow bg-light bg-gradient
              <li key={task._id} className={`list-group-item list fw-semibold  my-2 shadow ${task.status == "started" ? "bg-light bg-gradient text-dark" : task.status == "pending" ? "bg-danger bg-gradient text-light" : "bg-dark bg-gradient text-light"}`}>
                <div className="d-flex justify-content-evenly align-items-center ">
                  <div onClick={() => handleUpdateTask(task._id)} className="  d-flex cursore-pointer align-items-center   h100">
                    <h5 className="cursor-pointer  ">{task.title} :- </h5>

                    <h6 className="cursor-pointer ">{task.description.slice(0, 18)}...</h6>
                  </div>
                  <div className=" cursore-pointer h100 d-flex align-items-center ">
                    <span className="">Status: {task.status}</span>
                  </div>
                  <div onClick={() => changeStatus(task._id, task.status)} className=" d-flex align-items-center cursore-pointer  h100">
                    <span className="cursor-pointer">Change status</span>
                  </div>
                  <div onClick={() => deleteTask(task._id)} className=" px-4  cursore-pointer h100  ">
                    <div className="cursor-pointer trash-can">
                      <i className="bi bi-trash3-fill"></i>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
