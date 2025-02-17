import React, { useReducer } from 'react';

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, { id: Date.now(), text: action.payload }];
    case 'REMOVE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
};

const TaskManager = () => {
  const [tasks, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = React.useState('');

  const handleAddTask = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD_TASK', payload: input });
      setInput('');
    }
  };

  return (
    <div className="task-manager">
      <h2>Gestor de Tareas</h2>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={handleAddTask}>Añadir</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => dispatch({ type: 'REMOVE_TASK', payload: task.id })}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
