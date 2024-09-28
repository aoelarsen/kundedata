import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;
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

    // Logg svaret for å se dataene som kommer fra serveren
    const dailyTasksData = await dailyTasksResponse.json();
    const completedTasksData = await completedTasksResponse.json();
    console.log('Hentede daglige oppgaver:', dailyTasksData);
    console.log('Hentede fullførte oppgaver:', completedTasksData);

    // Filtrerer oppgaver for riktig butikk
    const filteredDailyTasks = dailyTasksData.filter(task => task.store === butikkid);
    console.log('Filtrerte daglige oppgaver for butikk:', filteredDailyTasks);

    // Oppdater oppgavene basert på om de er fullført i dag
    const updatedDailyTasks = filteredDailyTasks.map((task) => {
      const completedTask = completedTasksData.find(ct => ct.task === task.task && ct.store === butikkid);

      if (completedTask) {
        const completedDate = new Date(completedTask.dateCompleted).toISOString().split('T')[0];
        console.log('Sammenligning - Fullført dato:', completedDate, 'Dagens dato:', today);
        if (completedDate === today) {
          console.log('Oppgaven er fullført i dag:', task);
          return { ...task, completed: true, completedBy: completedTask.employee, dateCompleted: completedTask.dateCompleted };
        }
      }

      // Hvis ikke fullført i dag, sett completed til false
      return { ...task, completed: false };
    });

    // Logg oppdaterte oppgaver for å se endringene som gjøres
    console.log('Oppdaterte daglige oppgaver:', updatedDailyTasks);

    setDailyTasks(updatedDailyTasks);
  } catch (error) {
    console.error('Feil ved henting av faste oppgaver:', error);
  }
}, [butikkid, today]);

  
  // Hent egendefinerte oppgaver (inkluder fullførte oppgaver)
const fetchCustomTasks = useCallback(async () => {
  try {
    const [customTasksResponse, completedTasksResponse] = await Promise.all([
      fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks'),
      fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=custom')
    ]);

    const customTasksData = await customTasksResponse.json();
    const completedTasksData = await completedTasksResponse.json();

    // Oppdater filtreringslogikken for å bruke _id i stedet for oppgavebeskrivelse
    const filteredCustomTasks = customTasksData.filter(task => task.store === butikkid).map((task) => {
      const completedTask = completedTasksData.find(ct => ct.taskId === task._id && ct.store === butikkid);
      if (completedTask) {
        return { ...task, completed: true, completedBy: completedTask.employee, dateCompleted: completedTask.dateCompleted };
      }
      return task;
    });
    

    setCustomTasks(filteredCustomTasks);
  } catch (error) {
    console.error('Feil ved henting av egendefinerte oppgaver:', error);
  }
}, [butikkid]);


  // Hent fullførte oppgaver
  const fetchCompletedTasks = useCallback(async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks');
      const data = await response.json();

      const filteredTasks = data.filter(task => task.store === butikkid);
      setCompletedTasks(filteredTasks.slice(-10).reverse());
    } catch (error) {
      console.error('Feil ved henting av fullførte oppgaver:', error);
    }
  }, [butikkid]);

  useEffect(() => {
    fetchDailyTasks();
    fetchCustomTasks();
    fetchCompletedTasks();
  }, [fetchDailyTasks, fetchCustomTasks, fetchCompletedTasks]);

 // Legg til ny egendefinert oppgave
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
      
      // Hent oppdaterte fullførte oppgaver
      await fetchCompletedTasks();
    } else {
      console.error('Feil ved lagring av oppgave');
    }
  } catch (error) {
    console.error('Feil ved kommunikasjon med serveren:', error);
  }
};

  // Marker daglig oppgave som fullført
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const completionDate = new Date().toISOString();
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: completionDate,
      employee,
      store: butikkid,
    };

    try {
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

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

  const handleCompleteCustomTask = async (taskId, taskDescription, dueDate) => {
    const completionDate = new Date().toISOString();
    const bodyData = {
      taskId, // Inkluder oppgave-ID her
      task: taskDescription,
      taskType: 'custom',
      dueDate,
      dateCompleted: completionDate,
      employee,
      store: butikkid,
    };
  
    try {
      // Send POST-forespørsel til backend for å registrere oppgaven som fullført
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
  
      if (response.ok) {
        // Oppdater oppgave som fullført i backend med en PATCH-forespørsel
        const patchResponse = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true, completedBy: employee, dateCompleted: completionDate }),
        });
  
        if (patchResponse.ok) {
          // Oppdater lokalt tilstanden av oppgaven som fullført
          setCustomTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate } : task
            )
          );
        } else {
          console.error('Feil ved oppdatering av egendefinert oppgave i backend');
        }
      } else {
        console.error('Feil ved oppdatering av fullførte oppgaver i completedtasks');
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