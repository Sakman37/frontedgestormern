import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/dashboard.css';

// Usar la URL del backend desde las variables de entorno
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5006";

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

  // Cargar datos del usuario y tareas al iniciar sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !storedUser) return navigate('/');

    setUser(storedUser);

    const fetchTasks = async () => {
      try {
        const tasksRes = await axios.get(`${API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
        alert("Hubo un error al cargar las tareas.");
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
        const updatedTask = await axios.put(`${API_URL}/api/tasks/${selectedTask._id}`,
          { title, description, deadline, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasks.map(task => task._id === updatedTask.data._id ? updatedTask.data : task));
      } else {
        const newTask = await axios.post(`${API_URL}/api/tasks`,
          { title, description, deadline, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, newTask.data]);
      }
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      alert("Hubo un error al guardar la tarea.");
    }
    setTitle('');
    setDescription('');
    setDeadline('');
    setStatus('pendiente');
    
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
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
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
