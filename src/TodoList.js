import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [customTaskDate, setCustomTaskDate] = useState('');
  const [employee, setEmployee] = useState(Cookies.get('selectedEmployee') || ''); // Ansatt hentet fra cookie
  const [store, setStore] = useState(Cookies.get('selectedStore') || ''); // Butikk hentet fra cookie

  useEffect(() => {
    fetchDailyTasks();
    fetchCustomTasks();
  }, []);

  // Funksjon for å oppdatere todo-listen ved midnatt
  useEffect(() => {
    const updateTodoAtMidnight = () => {
      const now = new Date();
      const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

      setTimeout(() => {
        fetchDailyTasks(); // Resetter daglige oppgaver
        fetchCustomTasks(); // Oppdaterer egendefinerte oppgaver
        updateTodoAtMidnight(); // Set next timeout
      }, msUntilMidnight);
    };

    updateTodoAtMidnight();
  }, []);

  // Hent daglige oppgaver fra serveren
  const fetchDailyTasks = async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks');
      const data = await response.json();
      setDailyTasks(data);
    } catch (error) {
      console.error('Feil ved henting av faste oppgaver:', error);
    }
  };

  // Hent egendefinerte oppgaver fra serveren
  const fetchCustomTasks = async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks');
      const data = await response.json();
      setCustomTasks(data);
    } catch (error) {
      console.error('Feil ved henting av oppgaver:', error);
    }
  };

// Funksjon for å markere en daglig oppgave som fullført og lagre til databasen
const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: new Date().toISOString(),
      employee,
      store, // Butikk-ID inkludert
    };
  
    console.log('Sender POST request med data:', bodyData); // Logg dataen før den sendes
  
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
  
      if (response.ok) {
        setDailyTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee } : task
          )
        );
      } else {
        console.error('Feil ved oppdatering av daglig oppgave:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };
  
  
  // Funksjon for å markere en egendefinert oppgave som fullført og lagre til databasen
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: new Date().toISOString(),
      employee,
      store, // Butikk-ID inkludert
    };

    console.log('Sender POST request med data:', bodyData); // Logg dataen før den sendes
  
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        console.log("Oppgaven ble registrert som fullført:", await response.json());
        setDailyTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee } : task
          )
        );
      } else {
        console.error('Feil ved oppdatering av daglig oppgave:', response.statusText);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
};


  // Funksjon for å legge til en ny egendefinert oppgave
  const handleAddCustomTask = async () => {
    if (!newCustomTask || !customTaskDate) {
      alert('Oppgaven og dato må fylles ut.');
      return;
    }

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newCustomTask,
          dueDate: customTaskDate,
        }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setCustomTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewCustomTask('');
        setCustomTaskDate('');
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Todo-liste</h2>

      <div>
        <h3 className="text-2xl font-bold mb-4">Faste oppgaver</h3>
        <ul>
          {dailyTasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>{task.task}</span>
              {task.completed ? (
                <span>Utført av {task.completedBy}</span>
              ) : (
                <button
                  onClick={() => handleCompleteDailyTask(task._id, task.task)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Utført
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Dagens oppgaver</h3>
        <ul>
          {customTasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>{task.task} - {new Date(task.dueDate).toLocaleDateString()}</span>
              {task.completed ? (
                <span>Utført av {task.completedBy}</span>
              ) : (
                <button
                  onClick={() => handleCompleteCustomTask(task._id, task.task, task.dueDate)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Utført
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Ny oppgave"
            value={newCustomTask}
            onChange={(e) => setNewCustomTask(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <input
            type="date"
            value={customTaskDate}
            onChange={(e) => setCustomTaskDate(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button onClick={handleAddCustomTask} className="bg-blue-500 text-white px-4 py-1 rounded">
            Legg til oppgave
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
