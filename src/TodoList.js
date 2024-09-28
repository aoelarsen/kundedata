import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const butikkid = parseInt(Cookies.get('butikkid'), 10) || null;
  const employee = Cookies.get('selectedEmployee') || '';

  // Hent oppgaver
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5001/todos');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Feil ved henting av oppgaver:', error);
      }
    };

    fetchTasks();
  }, []);

  // Legg til ny oppgave
  const handleAddTask = async () => {
    if (!newTask || !butikkid) {
      alert('Oppgaven og butikk-ID må fylles ut.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: newTask,
          store: butikkid,
        }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewTask('');
      } else {
        console.error('Feil ved lagring av oppgave');
      }
    } catch (error) {
      console.error('Feil ved kommunikasjon med serveren:', error);
    }
  };

  // Marker oppgave som fullført
  const handleCompleteTask = async (taskId) => {
    const completionDate = new Date().toISOString();

    try {
      const response = await fetch(`http://localhost:5001/todos/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
          completedBy: employee,
          dateCompleted: completionDate,
        }),
      });

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, completed: true, completedBy: employee, dateCompleted: completionDate }
              : task
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

      {/* Oppgaver */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Oppgaver</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex flex-row justify-between items-center mb-2">
              <span className="flex-1">
                {task.task}
                {task.completed && (
                  <div className="text-green-600 md:ml-4">(Utført av: {task.completedBy})</div>
                )}
              </span>
              {!task.completed ? (
                <button
                  onClick={() => handleCompleteTask(task._id)}
                  className="bg-green-500 text-white px-4 py-1 rounded md:ml-4"
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

      {/* Legg til ny oppgave */}
      <div className="mt-6">
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
    </div>
  );
}

export default TodoList;
