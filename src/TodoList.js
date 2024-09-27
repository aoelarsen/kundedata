import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  // Hent butikk-ID fra cookies som i OrderList
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;

  // Hent dagens dato i formatet yyyy-mm-dd for input type="date"
  const today = new Date().toISOString().split('T')[0];

  const [customTaskDate, setCustomTaskDate] = useState(today);
  const [employee] = useState(Cookies.get('selectedEmployee') || '');

  // Hent daglige oppgaver
  const fetchDailyTasks = useCallback(async () => {
    try {
      const [dailyTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=daily')
      ]);

      const dailyTasksData = await dailyTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      // Filtrer oppgaver relatert til butikkID
      const filteredDailyTasks = dailyTasksData.filter(task => task.store === butikkid);

      const updatedDailyTasks = filteredDailyTasks.map((task) => {
        const completedTask = completedTasksData.find(ct => ct.task === task.task && ct.store === butikkid);

        // Hvis oppgaven er fullført, sjekk om den ble fullført i dag
        if (completedTask) {
          const completedDate = new Date(completedTask.dateCompleted).toISOString().split('T')[0];

          // Hvis fullføringsdatoen er dagens dato, behold den som fullført
          if (completedDate === today) {
            return { ...task, completed: true, completedBy: completedTask.employee, dateCompleted: completedTask.dateCompleted };
          }
        }
        return task; // Behold oppgaven som den er hvis ikke fullført i dag
      });

      setDailyTasks(updatedDailyTasks);
    } catch (error) {
      console.error('Feil ved henting av faste oppgaver:', error);
    }
  }, [butikkid, today]);


  // Hent egendefinerte oppgaver
  const fetchCustomTasks = useCallback(async () => {
    try {
      const [customTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=custom')
      ]);

      const customTasksData = await customTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      const filteredCustomTasks = await Promise.all(
        customTasksData.filter(task => task.store === butikkid).map(async (task) => {
          const completedTask = completedTasksData.find(ct => ct.task === task.task && ct.store === butikkid);

          if (completedTask) {
            const completedDate = new Date(completedTask.dateCompleted).toISOString().split('T')[0];

            // Hvis fullføringsdatoen er eldre enn dagens dato, slett oppgaven fra customTasks
            if (completedDate !== today) {
              await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${task._id}`, {
                method: 'DELETE',
              });
              return null;  // Returner null slik at vi kan filtrere bort denne oppgaven
            }
            return { ...task, completed: true, completedBy: completedTask.employee, dateCompleted: completedTask.dateCompleted };
          }

          return task;  // Hvis ikke fullført, behold oppgaven
        })
      );

      // Filtrer bort null-oppgaver
      setCustomTasks(filteredCustomTasks.filter(task => task !== null));
    } catch (error) {
      console.error('Feil ved henting av egendefinerte oppgaver:', error);
    }
  }, [butikkid, today]);


  // Hent fullførte oppgaver
  const fetchCompletedTasks = useCallback(async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks');
      const data = await response.json();

      const filteredTasks = data.filter(task => task.store === butikkid);

      setCompletedTasks(filteredTasks.slice(-10).reverse()); // Hent de siste 10 oppgavene og sorter nyeste først
    } catch (error) {
      console.error('Feil ved henting av fullførte oppgaver:', error);
    }
  }, [butikkid]);

  useEffect(() => {
    fetchDailyTasks();
    fetchCustomTasks();
    fetchCompletedTasks();
  }, [fetchDailyTasks, fetchCustomTasks, fetchCompletedTasks]);

  // Funksjon for å legge til en ny egendefinert oppgave
  const handleAddCustomTask = async () => {
    if (!newCustomTask || !customTaskDate || !butikkid) {
      alert('Oppgaven, dato og butikk-ID må fylles ut.');
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
          store: butikkid,
        }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setCustomTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewCustomTask('');
        setCustomTaskDate(today);
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Funksjon for å markere en daglig oppgave som fullført
  // Funksjon for å markere en daglig oppgave som fullført
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const completionDate = new Date().toISOString(); // Fullføringsdato
    const formattedToday = new Date().toISOString().split('T')[0]; // Dagens dato i formatet yyyy-mm-dd

    console.log('Dagens dato:', formattedToday);
    console.log('Oppgave fullført på dato:', completionDate.split('T')[0]);

    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: completionDate,
      employee,
      store: butikkid,
    };

    try {
      // Lagre fullført oppgave i completedTasks
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      // Oppdater status for daglig oppgave i dailytasks
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, completedBy: employee, dateCompleted: completionDate }),
      });

      if (response.ok) {
        setDailyTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate } : task
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
      dateCompleted: new Date().toISOString(),
      employee,
      store: butikkid,
    };

    try {
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

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

      {/* Faste oppgaver */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Faste oppgaver</h3>
        <ul>
          {dailyTasks.map((task) => (
            <li key={task._id} className="flex flex-row justify-between items-center mb-2">
              <span className="flex-1">
                {task.task}
                {task.completed && (
                  <div className="text-green-600 md:ml-4">(Utført av: {task.completedBy})</div>
                )}
              </span>
              {!task.completed ? (
                <button
                  onClick={() => handleCompleteDailyTask(task._id, task.task)}
                  className="bg-green-500 text-white px-4 py-1 rounded md:ml-4"
                >
                  {/* Merk-knapp på mobil, Merk som utført på større skjermer */}
                  <span className="block md:hidden">Merk</span>
                  <span className="hidden md:block">Merk som utført</span>
                </button>
              ) : (
                <span className="text-gray-500">Utført</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Dagens oppgaver */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Dagens oppgaver</h3>
        <ul>
          {customTasks.map((task) => (
            <li key={task._id} className="flex flex-row justify-between items-center mb-2">
              <span className="flex-1">
                {task.task}
                {task.completed && (
                  <div className="text-green-600 md:ml-4">(Utført av: {task.completedBy})</div>
                )}
              </span>
              {!task.completed ? (
                <button
                  onClick={() => handleCompleteCustomTask(task._id, task.task, task.dueDate)}
                  className="bg-green-500 text-white px-4 py-1 rounded md:ml-4"
                >
                  <span className="block md:hidden">Merk</span>
                  <span className="hidden md:block">Merk som utført</span>
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

      {/* Siste 10 fullførte oppgaver */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Siste 10 fullførte oppgaver</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Oppgave</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Utført av</th>
              <th className="hidden md:table-cell px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Dato</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.task}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.employee}</td>
                <td className="hidden md:table-cell px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {new Date(task.dateCompleted).toLocaleDateString()} {new Date(task.dateCompleted).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



}

export default TodoList;