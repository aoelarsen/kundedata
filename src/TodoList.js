import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Funksjon for å formatere datoen til dd.mm.åååå
const formatDate = (date) => {
  const d = new Date(date);
  let day = '' + d.getDate();
  let month = '' + (d.getMonth() + 1);
  const year = d.getFullYear();

  if (day.length < 2) day = '0' + day;
  if (month.length < 2) month = '0' + month;

  return [day, month, year].join('.');
};

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');

  // Hent dagens dato i formatet yyyy-mm-dd for input type="date"
  const today = new Date().toISOString().split('T')[0];

  // Sett dagens dato som standard
  const [customTaskDate, setCustomTaskDate] = useState(today);
  const [employee] = useState(Cookies.get('selectedEmployee') || ''); // Ansatt hentet fra cookie
  const [store] = useState(Cookies.get('selectedStore') || ''); // Butikk hentet fra cookie

  useEffect(() => {
    fetchDailyTasks();
    fetchCustomTasks();
  }, []);

  // Hent daglige oppgaver fra serveren
  const fetchDailyTasks = async () => {
    try {
      const [dailyTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=daily')
      ]);

      const dailyTasksData = await dailyTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      const updatedDailyTasks = dailyTasksData.map(task => {
        const completedTask = completedTasksData.find(ct => ct.task === task.task);
        return completedTask ? { ...task, completed: true, completedBy: completedTask.employee } : task;
      });

      setDailyTasks(updatedDailyTasks);
    } catch (error) {
      console.error('Feil ved henting av faste oppgaver:', error);
    }
  };

  const fetchCustomTasks = async () => {
    try {
      const [customTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=custom')
      ]);

      const customTasksData = await customTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      const updatedCustomTasks = customTasksData.map(task => {
        const completedTask = completedTasksData.find(ct => ct.task === task.task);
        return completedTask
          ? { ...task, completed: true, completedBy: completedTask.employee, dateCompleted: completedTask.dateCompleted }
          : task;
      });

      setCustomTasks(updatedCustomTasks);
    } catch (error) {
      console.error('Feil ved henting av egendefinerte oppgaver:', error);
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
        setCustomTaskDate(today); // Tilbakestill til dagens dato
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Funksjon for å markere en daglig oppgave som fullført og lagre til databasen
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: new Date().toISOString(),
      employee,  // Sørg for at employee har en gyldig verdi
      store,     // Sørg for at store har en gyldig verdi
    };


    try {
      // Oppdater completedtasks
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      // Oppdater dailytasks
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, completedBy: employee }),
      });

      if (response.ok) {
        setDailyTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee } : task
          )
        );
      }
    } catch (error) {
      console.error('Feil ved oppdatering av daglig oppgave:', error);
    }
  };

  // Funksjon for å markere en egendefinert oppgave som fullført
  const handleCompleteCustomTask = async (taskId, taskDescription, dueDate) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'custom',
      dueDate,
      dateCompleted: new Date().toISOString(), // Sørger for at fullføringsdato blir satt
      employee, // Ansatt som fullfører oppgaven
      store,
    };

    try {
      // Oppdater customtasks med fullføringsdato og ansatt
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, completedBy: employee, dateCompleted: new Date().toISOString() }),
      });

      if (response.ok) {
        setCustomTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: new Date() } : task
          )
        );
      }
    } catch (error) {
      console.error('Feil ved oppdatering av egendefinert oppgave:', error);
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
              <span>
                {task.task}
                {task.completed && (
                  <span className="ml-2 text-green-600">(Utført av: {task.completedBy})</span>
                )}
              </span>
              {!task.completed ? (
                <button
                  onClick={() => handleCompleteDailyTask(task._id, task.task)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Merk som utført
                </button>
              ) : (
                <span className="text-gray-500">Utført</span>
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
              <span>
                {task.task} - {new Date(task.dueDate).toLocaleDateString()}
                {task.completed && (
                  <span className="ml-2 text-green-600">(Utført av: {task.completedBy})</span>
                )}
              </span>
              {!task.completed ? (
                <button
                  onClick={() => handleCompleteCustomTask(task._id, task.task, task.dueDate)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Merk som utført
                </button>
              ) : (
                <span className="text-gray-500">Utført</span>
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