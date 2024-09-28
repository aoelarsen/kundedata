import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;
  const today = new Date().toISOString().split('T')[0];
  const employee = Cookies.get('selectedEmployee') || '';

  // Hent daglige oppgaver
  const fetchDailyTasks = useCallback(async () => {
    try {
      const [dailyTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=daily'),
      ]);

      const dailyTasksData = await dailyTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      const filteredDailyTasks = dailyTasksData.filter(task => task.store === butikkid);

      const updatedDailyTasks = filteredDailyTasks.map(task => {
        const completedTask = completedTasksData.find(ct => ct.task === task.task && ct.store === butikkid);
        if (completedTask) {
          return {
            ...task,
            completed: true,
            completedBy: completedTask.employee,
            dateCompleted: completedTask.dateCompleted,
          };
        }
        return { ...task, completed: false };
      });

      setDailyTasks(updatedDailyTasks);
    } catch (error) {
      console.error('Feil ved henting av faste oppgaver:', error);
    }
  }, [butikkid]);

  // Hent egendefinerte oppgaver (inkluder fullførte oppgaver)
  const fetchCustomTasks = useCallback(async () => {
    try {
      const [customTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=custom'),
      ]);

      const customTasksData = await customTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      // Oppdater oppgavene basert på om de er fullført
      const updatedCustomTasks = customTasksData.filter(task => task.store === butikkid).map(task => {
        const completedTask = completedTasksData.find(ct => ct.taskId === task._id && ct.store === butikkid);
        if (completedTask) {
          return {
            ...task,
            completed: true,
            completedBy: completedTask.employee,
            dateCompleted: completedTask.dateCompleted,
          };
        }
        return { ...task, completed: false };
      });

      setCustomTasks(updatedCustomTasks);
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
    if (!newCustomTask || !butikkid) {
      alert('Oppgavebeskrivelse og butikk-ID må fylles ut.');
      return;
    }

    const registeredDate = new Date().toISOString();
    const taskData = {
      task: newCustomTask,
      dueDate: today,
      store: butikkid,
      registeredDate,
      completed: false, // Sett completed til false når oppgaven blir opprettet
    };

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setCustomTasks(prevTasks => [...prevTasks, addedTask]);
        setNewCustomTask('');
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Marker oppgave som fullført
  const handleCompleteTask = async (taskId, taskDescription, isDaily = false) => {
    const completionDate = new Date().toISOString();
    const taskType = isDaily ? 'daily' : 'custom';

    const bodyData = {
      taskId,
      task: taskDescription,
      taskType,
      dateCompleted: completionDate,
      employee,
      store: butikkid,
    };

    try {
      const completedResponse = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (completedResponse.ok) {
        const patchResponse = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/${taskType}tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true, completedBy: employee, dateCompleted: completionDate }),
        });

        if (patchResponse.ok) {
          if (isDaily) {
            setDailyTasks(prevTasks =>
              prevTasks.map(task =>
                task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate } : task
              )
            );
          } else {
            setCustomTasks(prevTasks =>
              prevTasks.map(task =>
                task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate } : task
              )
            );
          }

          await fetchCompletedTasks();
        } else {
          console.error('Feil ved oppdatering av oppgave i backend');
        }
      } else {
        console.error('Feil ved registrering av fullført oppgave i completedtasks');
      }
    } catch (error) {
      console.error('Feil ved oppdatering av oppgave:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Todo-liste</h2>

      {/* Skjema for å legge til ny oppgave */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Ny oppgave"
          value={newCustomTask}
          onChange={(e) => setNewCustomTask(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleAddCustomTask} className="bg-blue-500 text-white px-4 py-1 rounded">
          Legg til oppgave
        </button>
      </div>

      {/* Faste oppgaver */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Faste oppgaver</h3>
        <ul>
          {dailyTasks.map(task => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>
                {task.task}
                {task.completed && <span className="text-green-600 ml-4">(Utført av: {task.completedBy})</span>}
              </span>
              {!task.completed ? (
                <button onClick={() => handleCompleteTask(task._id, task.task, true)} className="bg-green-500 text-white px-4 py-1 rounded">
                  Merk som utført
                </button>
              ) : (
                <span className="text-gray-500">Utført</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Egendefinerte oppgaver */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Egendefinerte oppgaver</h3>
        <ul>
          {customTasks.map(task => (
            <li key={task._id} className="flex justify-between items-center mb-2">
              <span>
                {task.task}
                {task.completed && <span className="text-green-600 ml-4">(Utført av: {task.completedBy})</span>}
              </span>
              {!task.completed ? (
                <button onClick={() => handleCompleteTask(task._id, task.task)} className="bg-green-500 text-white px-4 py-1 rounded">
                  Merk som utført
                </button>
              ) : (
                <span className="text-gray-500">Utført</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Siste 10 fullførte oppgaver */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Siste 10 fullførte oppgaver</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Oppgave</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Utført av</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600">Dato</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.task}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{task.employee}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
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
