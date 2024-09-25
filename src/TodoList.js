import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

  // Hent butikk-ID fra cookies som i OrderList
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null; // Konverterer til heltall, eller null hvis ikke tilgjengelig

  // Hent dagens dato i formatet yyyy-mm-dd for input type="date"
  const today = new Date().toISOString().split('T')[0];

  const [customTaskDate, setCustomTaskDate] = useState(today);
  const [employee] = useState(Cookies.get('selectedEmployee') || ''); // Hent ansatt fra cookies

  useEffect(() => {
    console.log('Butikk-ID ved oppdatering:', butikkid); // Logg butikk-ID for å verifisere at den hentes korrekt
    fetchDailyTasks();
    fetchCustomTasks();
    fetchCompletedTasks();
  }, [butikkid]);


  // Hent daglige oppgaver fra serveren
  const fetchDailyTasks = async () => {
    try {
      const [dailyTasksResponse, completedTasksResponse] = await Promise.all([
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks'),
        fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks?taskType=daily')
      ]);

      const dailyTasksData = await dailyTasksResponse.json();
      const completedTasksData = await completedTasksResponse.json();

      // Hent dagens dato i yyyy-mm-dd format for sammenligning
      const today = new Date().toISOString().split('T')[0];

      const updatedDailyTasks = await Promise.all(
        dailyTasksData.map(async (task) => {
          const completedTask = completedTasksData.find(ct => ct.task === task.task);

          if (completedTask) {
            // Hent fullføringsdato og sammenlign med dagens dato
            const completedDate = new Date(completedTask.dateCompleted).toISOString().split('T')[0];

            if (completedDate === today) {
              // Oppgaven er fullført i dag, vis den som fullført
              return { ...task, completed: true, completedBy: completedTask.employee };
            } else {
              // Hvis fullføringsdatoen ikke er dagens dato, tilbakestill oppgaven
              await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/dailytasks/${task._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: false, completedBy: null, dateCompleted: null }),
              });
              return { ...task, completed: false, completedBy: null };
            }
          } else {
            return task;
          }
        })
      );

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

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks');
      const data = await response.json();
      setCompletedTasks(data.slice(-10).reverse()); // Hent de siste 10 oppgavene og sorter nyeste først
    } catch (error) {
      console.error('Feil ved henting av fullførte oppgaver:', error);
    }
  };

  // Funksjon for å legge til en ny egendefinert oppgave
  const handleAddCustomTask = async () => {
    if (!newCustomTask || !customTaskDate || !butikkid) {
      alert('Oppgaven, dato og butikk-ID må fylles ut.');
      return;
    }

    try {
      console.log('Sender data til server:', {
        task: newCustomTask,
        dueDate: customTaskDate,
        store: butikkid,
      });

      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/customtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newCustomTask,
          dueDate: customTaskDate,
          store: parseInt(butikkid, 10), // Pass på at storeId er i riktig format
        }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setCustomTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewCustomTask('');
        setCustomTaskDate(today);
        console.log('Oppgave lagret:', addedTask);
      } else {
        const errorData = await response.json();
        console.error('Feil ved lagring av oppgave:', errorData.message);
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };






  // Funksjon for å markere en daglig oppgave som fullført og lagre til databasen
  const handleCompleteDailyTask = async (taskId, taskDescription) => {
    const now = new Date();
    now.setHours(now.getHours());  // Legger til 2 timer
    const bodyData = {
      task: taskDescription,
      taskType: 'daily',
      dateCompleted: now.toISOString(),  // Bruk ISO-format,
      employee,
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
        body: JSON.stringify({
          completed: true,
          completedBy: employee,
          dateCompleted: new Date().toISOString() // Legg til fullføringsdato
        }),
      });

      if (response.ok) {
        setDailyTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: new Date() } : task
          )
        );
      }
    } catch (error) {
      console.error('Feil ved oppdatering av daglig oppgave:', error);
    }
  };


  // Funksjon for å markere en egendefinert oppgave som fullført
  const handleCompleteCustomTask = async (taskId, taskDescription, dueDate) => {
    const now = new Date();
    now.setHours(now.getHours());  // Legger til 2 timer
    const bodyData = {
      task: taskDescription,
      taskType: 'custom',
      dueDate,
      dateCompleted: now.toISOString(),  // Sørger for at fullføringsdato blir satt
      employee, // Ansatt som fullfører oppgaven
      store: butikkid, // Legger til butikk-ID fra cookie
    };

    try {
      // Oppdater completedtasks med fullføringsdato, ansatt og butikkid
      await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/completedtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      // Oppdater customtasks med fullføringsdato, ansatt og butikkid
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
            {completedTasks.map((task) => (
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