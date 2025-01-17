import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const data = isRegistering ? { name, email, password } : { email, password };

      console.log('Datos enviados:', data); // Verificar los datos enviados

      const res = await axios.post(`http://localhost:5006/api/auth/${endpoint}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Respuesta del servidor:', res); // Verificar la respuesta

      if (!isRegistering) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));  // Guardamos el usuario
        navigate('/dashboard');
      } else {
        alert('Registro exitoso, ahora inicia sesión.');
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Error en la operación:', error);
      alert(error.response?.data?.msg || 'Error en la operación');
    }
  };

  return (
    <div className="wrapper d-flex justify-content-center align-items-center">
      <div className="login-form">
        <h1>Bienvenido al Gestor de Tareas</h1>
        <p>Creado por sakman37</p>
        <form onSubmit={handleSubmit}>
          <div className='input-box'>
            {isRegistering && (
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
          </div>
          <div className='input-box'>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='input-box'>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? 'Ya tengo cuenta, Iniciar Sesión'
            : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default Login;
