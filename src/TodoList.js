import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  // Tilstander for å holde oppgaver og formdata
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Hent informasjon fra cookies
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;
  const employee = Cookies.get('selectedEmployee') || '';

  // Funksjon for å hente oppgaver fra API-et
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/tasks');
      const data = await response.json();
      setTasks(data.filter(task => task.store === butikkid)); // Filtrer oppgaver etter butikkid
    } catch (error) {
      console.error('Feil ved henting av oppgaver:', error);
    }
  }, [butikkid]);

  // useEffect for å hente oppgaver ved lasting av siden
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Funksjon for å legge til ny oppgave
  const handleAddTask = async () => {
    if (!newTask || !butikkid) {
      alert('Oppgavebeskrivelse og butikk-ID må fylles ut.');
      return;
    }

    const registeredDate = new Date().toISOString();
    const taskData = {
      task: newTask,
      registeredDate,
      store: butikkid,
    };

    try {
      const response = await fetch('https://kundesamhandling-acdc6a9165f8.herokuapp.com/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks(prevTasks => [...prevTasks, addedTask]);
        setNewTask('');
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Funksjon for å markere oppgave som fullført
  const handleCompleteTask = async (taskId) => {
    const completionDate = new Date().toISOString();

    try {
      const response = await fetch(`https://kundesamhandling-acdc6a9165f8.herokuapp.com/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          completedBy: employee,
          dateCompleted: completionDate,
        }),
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate } : task
          )
        );
      } else {
        console.error('Feil ved oppdatering av oppgave');
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
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-1 rounded">
          Legg til oppgave
        </button>
      </div>

      {/* Liste over oppgaver */}
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="flex flex-row justify-between items-center mb-2">
            <span className="flex-1">
              {task.task}
              {task.completed && (
                <>
                  <div className="text-green-600 md:ml-4">(Utført av: {task.completedBy})</div>
                  <div>Dato fullført: {new Date(task.dateCompleted).toLocaleString()}</div>
                </>
              )}
            </span>
            {!task.completed ? (
              <button
                onClick={() => handleCompleteTask(task._id)}
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
  );
}

export default TodoList;
