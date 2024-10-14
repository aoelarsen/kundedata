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
      const dailyTasksResponse = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks');
      const dailyTasksData = await dailyTasksResponse.json();

      console.log('Daily Tasks Data:', dailyTasksData); // Logge oppgavene

      // Filtrer oppgaver relatert til butikkID
      const filteredDailyTasks = dailyTasksData.filter(task => task.store === butikkid);

      const updatedDailyTasks = [];

      for (const task of filteredDailyTasks) {
        if (task.completed && task.dateCompleted) {
          const completedDate = new Date(task.dateCompleted).toISOString().split('T')[0];

          if (completedDate !== today) {
            // Logg oppgaven som skal oppdateres
            console.log(`Oppgave "${task.task}" har en dato (${completedDate}) som er forskjellig fra dagens dato (${today}) og vil bli oppdatert til completed: false.`);

            // Oppdater oppgaven i databasen hvis datoen ikke samsvarer med dagens dato
            const updateResponse = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks/${task._id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completed: false, completedBy: null, dateCompleted: null }),
            });

            if (updateResponse.ok) {
              const updatedTask = await updateResponse.json();
              console.log('Oppgave oppdatert til completed: false:', updatedTask);
              updatedDailyTasks.push({ ...task, completed: false, completedBy: null });
            } else {
              console.error('Feil ved oppdatering av oppgave:', updateResponse.status);
            }
          } else {
            // Logg oppgaven som har fullført dato som dagens dato
            console.log(`Oppgave "${task.task}" har fullføringsdato (${completedDate}) som dagens dato (${today}).`);
            updatedDailyTasks.push(task); // Oppgaven er fortsatt fullført for i dag
          }
        } else {
          updatedDailyTasks.push(task); // Ikke fullført oppgave legges til som den er
        }
      }

      console.log('Oppdaterte daglige oppgaver:', updatedDailyTasks);
      setDailyTasks(updatedDailyTasks);

    } catch (error) {
      console.error('Feil ved henting av daglige oppgaver:', error);
    }
  }, [butikkid, today]);









  // Hent egendefinerte oppgaver
  // Hent egendefinerte oppgaver
  const fetchCustomTasks = useCallback(async () => {
    try {
      const customTasksResponse = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks');
      const customTasksData = await customTasksResponse.json();
      const filteredCustomTasks = customTasksData.filter(task => task.store === butikkid);

      const updatedCustomTasks = [];

      for (const task of filteredCustomTasks) {
        if (task.completed) {
          // Hvis oppgaven er markert som fullført, slett den fra 'customtasks'
          const deleteResponse = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${task._id}`, {
            method: 'DELETE',
          });

          if (deleteResponse.ok) {
            console.log(`Oppgave ${task.task} slettet fra customtasks fordi den er fullført.`);
          } else {
            console.error(`Feil ved sletting av oppgave ${task.task}:`, deleteResponse.statusText);
          }
        } else {
          // Hvis oppgaven ikke er fullført, legg den til i den oppdaterte listen
          updatedCustomTasks.push(task);
        }
      }

      // Oppdater state med ikke-fullførte oppgaver
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
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
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

      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true, completedBy: employee, dateCompleted: new Date().toISOString() }),
      });

      if (response.ok) {
        setDailyTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId
              ? { ...task, completed: true, completedBy: employee, dateCompleted: new Date().toISOString().split('T')[0] }
              : task
          )
        );
        // Hent de siste fullførte oppgavene på nytt
        await fetchCompletedTasks();
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
      // Legg til oppgaven i 'completedtasks' collection
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      // Oppdater 'customtasks' med utførtdato og ansatt
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedBy: employee, dateCompleted: new Date().toISOString() }),
      });

      if (response.ok) {
        setCustomTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, completedBy: employee, dateCompleted: new Date(), completed: !!employee }
              : task
          )
        );
        // Hent de siste fullførte oppgavene på nytt
        await fetchCompletedTasks();
      }
    } catch (error) {
      console.error('Feil ved oppdatering av egendefinert oppgave:', error);
    }
  };

  const handleAddEmployeeToCompletedTask = async (taskId, taskDescription, dueDate) => {
    const bodyData = {
      task: taskDescription,
      taskType: 'custom',
      dueDate,
      dateCompleted: new Date().toISOString(),
      employee,
      store: butikkid,
    };

    try {
      console.log('Sender følgende data til completedtasks:', bodyData);

      // Legg til oppgaven i 'completedtasks' collection med ny ansatt
      const completedResponse = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!completedResponse.ok) {
        throw new Error('Feil ved lagring i completedtasks');
      }

      console.log('Oppgaven ble lagret i completedtasks');

      const patchData = { extraEmployeeAdded: true };
      console.log('Sender følgende data til customtasks PATCH:', patchData);

      // Oppdater 'customtasks' for å sette `extraEmployeeAdded` til true
      const patchResponse = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
      });

      if (!patchResponse.ok) {
        throw new Error('Feil ved oppdatering av customtasks');
      }

      console.log('Oppgaven ble oppdatert i customtasks med extraEmployeeAdded');

      // Oppdater lokal tilstand for å skjule "+"-knappen etter første bruk
      setCustomTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, extraEmployeeAdded: true } : task
        )
      );

      // Hent de siste fullførte oppgavene på nytt
      await fetchCompletedTasks();

    } catch (error) {
      console.error('Feil ved oppdatering av fullført oppgave:', error);
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
                {task.dateCompleted && task.completedBy && (
                  <div className="text-green-600 md:ml-4">(Utført av: {task.completedBy}, {new Date(task.dateCompleted).toLocaleDateString()})</div>
                )}
              </span>
              {!(task.dateCompleted && task.completedBy) ? (
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

              {/* Vise "+"-knappen hvis oppgaven er fullført, men ekstra ansatt ikke er lagt til */}
              {task.dateCompleted && task.completedBy && !task.extraEmployeeAdded && (
                <span
                  onClick={() => handleAddEmployeeToCompletedTask(task._id, task.task, task.dueDate)}
                  style={{ cursor: 'pointer', color: '#007bff' }}
                >
                  +
                </span>
              )}

            </li>
          ))}

        </ul>


        {/* Legg til ny oppgave - justert for to linjer på mobil */}
        <div className="mt-6">
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
            {/* Første linje - Oppgavefelt */}
            <input
              type="text"
              placeholder="Ny oppgave"
              value={newCustomTask}
              onChange={(e) => setNewCustomTask(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 mt-2">
            {/* Andre linje - Dato og knapp */}
            <input
              type="date"
              value={customTaskDate}
              onChange={(e) => setCustomTaskDate(e.target.value)}
              className="border p-2 rounded w-full md:w-auto"
            />
            <button onClick={handleAddCustomTask} className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto">
              Legg til oppgave
            </button>
          </div>
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