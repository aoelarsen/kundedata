import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [customTaskDate, setCustomTaskDate] = useState('');
  const [employee, setEmployee] = useState(Cookies.get('selectedEmployee') || ''); // Ansatt hentet fra cookie

  useEffect(() => {
    fetchDailyTasks();
    fetchCustomTasks();
  }, []);

  const fetchDailyTasks = async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks');
      const data = await response.json();
      setDailyTasks(data);
    } catch (error) {
      console.error('Feil ved henting av faste oppgaver:', error);
    }
  };

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
  const handleCompleteDailyTask = async (taskId) => {
    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          employee,
          dateCompleted: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Oppdatere listen ved å fjerne oppgaven lokalt
        setDailyTasks(dailyTasks.filter((task) => task._id !== taskId));
      } else {
        console.error('Feil ved oppdatering av daglig oppgave');
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

  // Funksjon for å markere egendefinert oppgave som fullført
  const handleCompleteCustomTask = async (taskId) => {
    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          employee,
          dateCompleted: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setCustomTasks(customTasks.filter((task) => task._id !== taskId));
      } else {
        console.error('Feil ved oppdatering av oppgave');
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
              <button
                onClick={() => handleCompleteDailyTask(task._id)}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Utført
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Egendefinerte oppgaver</h3>
        <ul>
          {customTasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>{task.task} - {new Date(task.dueDate).toLocaleDateString()}</span>
              <button
                onClick={() => handleCompleteCustomTask(task._id)}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Utført
              </button>
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
