import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './componets/Navbar';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [taskToDelete, setTaskToDelete] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [editingTodo, setEditingTodo] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true); 

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEdit = (id) => {
    const taskToEdit = todos.find(item => item.id === id);
    setTodo(taskToEdit.todo);
    setIsEditing(true);
    setEditingTodo(taskToEdit);
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    const newTodos = todos.filter(item => item.id !== taskToDelete);
    setTodos(newTodos);
    setShowModal(false);
    setTaskToDelete(null);
    saveToLS(newTodos);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleAdd = () => {
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTodo('');
    saveToLS(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => item.id === id);
    if (index !== -1) {
      let newTodos = [...todos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      setTodos(newTodos);
      saveToLS(newTodos);
    }
  };

  const handleSaveEdit = () => {
    const updatedTodos = todos.map(item =>
      item.id === editingTodo.id ? { ...item, todo } : item
    );
    setTodos(updatedTodos);
    setTodo('');
    setIsEditing(false);
    setEditingTodo(null);
    saveToLS(updatedTodos);
  };

  const toggleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-5 bg-gray-800 min-h-[80vh]">
        <div className="addTodo my-5">
          <h2 className='text-lg font-bold text-white'>{isEditing ? 'Edit Task' : 'Add a Task'}</h2>
          <input
            onChange={handleChange}
            value={todo}
            type='text'
            className='w-1/2 p-2 rounded-md text-black'
          />
          <button
            onClick={isEditing ? handleSaveEdit : handleAdd}
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm font-bold py-1 rounded-md mx-6'
          >
            {isEditing ? 'Save Changes' : 'Add'}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className='text-lg font-bold text-white'>Your Tasks</h2>
          <button
            onClick={toggleShowCompleted}
            className='bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm font-bold py-1 rounded-md'
          >
            {showCompleted ? 'Hide Completed Tasks' : 'Show Completed Tasks'}
          </button>
        </div>

        <div className="todos">
          {todos.length === 0 && (
            <div className="m-5 p-6 text-center bg-gray-700 text-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-yellow-400 animate-pulse">No Tasks for Now</h3>
              <p className="text-gray-400">Start by adding a task to your list</p>
            </div>
          )}
          {todos.filter(item => !item.isCompleted || showCompleted).map(item => (
            <div key={item.id} className="todo flex justify-between items-center bg-gray-700 p-4 m-2 rounded-lg">
              <input
                name={item.id}
                onChange={handleCheckbox}
                type="checkbox"
                checked={item.isCompleted}
                className="mr-3"
              />
              <div className={item.isCompleted ? "line-through text-gray-500" : ""}>
                {item.todo}
              </div>
              <div className="buttons flex">
                <button 
                  onClick={() => handleEdit(item.id)} 
                  className='bg-blue-500 hover:bg-blue-600 text-white p-2 text-sm font-bold py-1 rounded-md mx-1'>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='bg-red-500 hover:bg-red-600 text-white p-2 text-sm font-bold py-1 rounded-md mx-1'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">Are you sure you want to delete this task?</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
