import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.css';  // Asegúrate de que el archivo CSS esté importado correctamente

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('pendiente');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) return navigate('/');

    setUser(user);

    const fetchTasks = async () => {
      try {
        const tasksRes = await axios.get('http://localhost:5006/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Hubo un error al obtener las tareas.");
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleAddOrUpdateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    try {
      if (isEditing) {
        const updatedTask = await axios.put(`http://localhost:5006/api/tasks/${selectedTask._id}`,
          { title, description, deadline, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map(task => task._id === updatedTask.data._id ? updatedTask.data : task));
      } else {
        const newTask = await axios.post('http://localhost:5006/api/tasks',
          { title, description, deadline, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, newTask.data]);
      }
    } catch (error) {
      console.error("Error adding/updating task:", error);
      alert("Hubo un error al guardar la tarea.");
    }

    setShowForm(false);
    setIsEditing(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
    setStatus(task.status);
    setIsEditing(true);
    setShowForm(true);
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5006/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Hubo un error al eliminar la tarea.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h1>Bienvenid@, {user?.name}!</h1>
      <button onClick={() => { setShowForm(true); setIsEditing(false); }}>Agregar Tarea</button>
      <button onClick={logout}>Cerrar Sesión</button>

      {showForm && (
        <form className="task-form" onSubmit={handleAddOrUpdateTask}>
          <input 
            type="text" 
            placeholder="Título" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="Descripción" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <input 
            type="date" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)} 
            required 
          />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
          <button type="submit">
            {isEditing ? 'Actualizar Tarea' : 'Guardar Tarea'}
          </button>
        </form>
      )}

      <h2>Tus Tareas</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.title}</h3>
            <p><strong>Descripción:</strong> {task.description}</p>
            <p><strong>Fecha de vencimiento:</strong> {task.deadline}</p>
            <p><strong>Estado:</strong> {task.status}</p>
            <div className="task-actions">
              <button onClick={() => handleEditTask(task)}>Editar</button>
              <button onClick={() => deleteTask(task._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
