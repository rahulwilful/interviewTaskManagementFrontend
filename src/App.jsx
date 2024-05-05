import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddTask from "./pages/AddTask.jsx";
import Tasks from "./pages/Tasks.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import UpadateTask from "./pages/UpdateTask.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {/*  <Tasks /> */}
        <ToastContainer />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/add" element={<AddTask />} />
            <Route path="/update-task/:taskId" element={<UpadateTask />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
