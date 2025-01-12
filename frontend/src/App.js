import React, { useState, useEffect } from "react";
import "./App.css";
import { FaCheckCircle, FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";

function App() {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("home");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [task, setTask] = useState({ title: "", description: "" });
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleSignUp = () => {
    const { email, password } = authData;
    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long");
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = existingUsers.find((user) => user.email === email);
    if (userExists) {
      setAuthError("User already exists. Please log in.");
      return;
    }
    const newUser = { email, password };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    const dummyToken = "some-valid-jwt-token";
    setToken(dummyToken);
    localStorage.setItem("token", dummyToken);
    setIsLoggedIn(true);
    setAuthError("");
    alert("Sign Up Successful");
  };

  const handleLogin = () => {
    const { email, password } = authData;
    if (!email || !password) {
      setAuthError("Email and password are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address");
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = existingUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (!user) {
      setAuthError("Invalid email or password");
      return;
    }
    const dummyToken = "some-valid-jwt-token";
    setToken(dummyToken);
    localStorage.setItem("token", dummyToken);
    setIsLoggedIn(true);
    setAuthError("");
    alert("Login Successful");
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  const handleCreateTask = () => {
    if (!task.title || !task.description) {
      alert("Title and description are required");
      return;
    }
    const newTask = {
      id: new Date().toISOString(),
      title: task.title,
      description: task.description,
      isCompleted: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTask({ title: "", description: "" });
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    const completedTask = tasks.find((task) => task.id === id);
    if (completedTask && !completedTask.isCompleted) {
      setCompletedTasks((prevCompletedTasks) => [
        ...prevCompletedTasks,
        completedTask,
      ]);
    } else {
      setCompletedTasks((prevCompletedTasks) =>
        prevCompletedTasks.filter((task) => task.id !== id)
      );
    }
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setCompletedTasks((prevCompletedTasks) =>
      prevCompletedTasks.filter((task) => task.id !== id)
    );
  };

  const handleEditTask = (taskToEdit) => {
    setEditTask(taskToEdit);
    setTask({ title: taskToEdit.title, description: taskToEdit.description });
  };

  const handleSaveEdit = () => {
    if (!task.title || !task.description) {
      alert("Title and description are required");
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === editTask.id
          ? { ...t, title: task.title, description: task.description }
          : t
      )
    );
    setCompletedTasks((prevCompletedTasks) =>
      prevCompletedTasks.map((t) =>
        t.id === editTask.id
          ? { ...t, title: task.title, description: task.description }
          : t
      )
    );
    setEditTask(null);
    setTask({ title: "", description: "" });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-6">{isSignUp ? "Sign Up" : "Login"}</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 mb-4 border border-gray-300 rounded-md shadow-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 mb-4 border border-gray-300 rounded-md shadow-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
          />
          {authError && <p className="text-red-500 text-center mb-4">{authError}</p>}
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="w-full p-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
          <p className="text-center mt-4">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-500 hover:underline"
                >
                  Login
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-500 hover:underline"
                >
                  Sign Up
                </button>
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
        <h2 className="text-3xl font-bold mb-10">Dashboard</h2>
        <ul>
          <li
            onClick={() => setCurrentSection("home")}
            className={`cursor-pointer mb-4 p-4 rounded-lg transition-colors duration-300 hover:bg-indigo-600 ${
              currentSection === "home" ? "bg-indigo-600" : ""
            }`}
          >
            Home
          </li>
          <li
            onClick={() => setCurrentSection("tasks")}
            className={`cursor-pointer mb-4 p-4 rounded-lg transition-colors duration-300 hover:bg-indigo-600 ${
              currentSection === "tasks" ? "bg-indigo-600" : ""
            }`}
          >
            Tasks
          </li>
          <li
            onClick={() => setCurrentSection("completed")}
            className={`cursor-pointer mb-4 p-4 rounded-lg transition-colors duration-300 hover:bg-indigo-600 ${
              currentSection === "completed" ? "bg-indigo-600" : ""
            }`}
          >
            Completed Tasks
          </li>
          <li
            onClick={handleLogout}
            className="cursor-pointer mb-4 p-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {currentSection === "home" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold">Total Tasks</h3>
              <p className="text-xl">{tasks.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold">Completed Tasks</h3>
              <p className="text-xl">{completedTasks.length}</p>
            </div>
          </div>
        )}

        {currentSection === "tasks" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Create a New Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter text"
                className="w-full p-4 border border-gray-300 rounded-md shadow-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
              <textarea
                placeholder="Task Description"
                className="w-full p-4 border border-gray-300 rounded-md shadow-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
              <button
                onClick={handleCreateTask}
                className="w-full p-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                <FaPlusCircle className="inline mr-2" /> Add Task
              </button>
            </div>

            <h3 className="text-2xl font-bold mt-8">Task List</h3>
            <ul className="space-y-6">
              {tasks.map((t) => (
                <li key={t.id} className="bg-white shadow-md rounded-md p-6 flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                  <div>
                    <h4 className="font-semibold text-xl">{t.title}</h4>
                    <p>{t.description}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => toggleTaskCompletion(t.id)}
                      className={`p-3 rounded-md text-white ${
                        t.isCompleted ? "bg-gray-400" : "bg-green-500"
                      }`}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleEditTask(t)}
                      className="p-3 rounded-md text-white bg-yellow-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-3 rounded-md text-white bg-red-500"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentSection === "completed" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Completed Tasks</h2>
            <ul className="space-y-6">
              {completedTasks.map((task) => (
                <li key={task.id} className="bg-white shadow-md rounded-md p-6 flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                  <div>
                    <h4 className="font-semibold text-xl">{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {editTask && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
              <h2 className="text-2xl font-bold mb-6">Edit Task</h2>
              <input
                type="text"
                className="w-full p-4 mb-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
              <textarea
                className="w-full p-4 mb-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
              <button
                onClick={handleSaveEdit}
                className="w-full p-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditTask(null)}
                className="w-full p-4 mt-4 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
