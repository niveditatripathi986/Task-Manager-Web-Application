import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import TaskManager from './components/TaskManager';
import { getTasks } from './services/taskService';

function App() {
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            fetchTasks();
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);

    const fetchTasks = async () => {
        const { data } = await getTasks(token);
        setTasks(data);
    };

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                <Auth setToken={setToken} />
            ) : (
                <TaskManager tasks={tasks} setTasks={setTasks} token={token} handleLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
