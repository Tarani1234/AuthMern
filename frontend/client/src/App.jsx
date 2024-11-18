import React, { useState, useEffect } from 'react';
import './index.css'
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loginTime, setLoginTime] = useState('');

  // Load login status, tasks, and login time from local storage on initial render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    const storedLoginTime = localStorage.getItem('loginTime');

    if (storedUser) {
      setUsername(storedUser.username);
      setIsLoggedIn(true);
      setLoginTime(storedLoginTime);
    }

    if (storedTasks) setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoggedIn]);

  // Handle login submission
  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        // Store new user credentials and login time in local storage
        const currentTime = new Date().toLocaleString();
        localStorage.setItem('user', JSON.stringify({ username, password }));
        localStorage.setItem('loginTime', currentTime);
        setLoginTime(currentTime);
        setIsLoggedIn(true);
      } else {
        // Verify login credentials and retrieve stored login time
        if (
          storedUser.username === username &&
          storedUser.password === password
        ) {
          const currentTime = new Date().toLocaleString();
          localStorage.setItem('loginTime', currentTime);
          setLoginTime(currentTime);
          setIsLoggedIn(true);
        } else {
          alert('Invalid username or password');
        }
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setTasks([]);
    setLoginTime('');
    localStorage.removeItem('user');
    localStorage.removeItem('tasks');
    localStorage.removeItem('loginTime');
  };

  // Handle input change for new task
  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  // Add a new task with timestamp
  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem = {
        id: Date.now(),
        text: newTask,
        completed: false,
        timestamp: new Date().toLocaleString(), // Add timestamp for task creation
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 sm:py-8 lg:py-12">
      <div className="w-full max-w-md px-4">
        {!isLoggedIn ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h2>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Log in
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {username}</h1>
            <p className="text-sm text-gray-600 mb-4">Login Time: {loginTime}</p>
            <button
              onClick={handleLogout}
              className="mb-6 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600"
            >
              Logout
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Manager</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Enter a new task"
                value={newTask}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>

            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow"
                >
                  <div className="flex flex-col">
                    <span
                      className={`${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      } cursor-pointer`}
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.text}
                    </span>
                    <span className="text-xs text-gray-500">Added on: {task.timestamp}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
