import { useState, ChangeEvent, FormEvent } from 'react';
import './Login.css';
import { useMutation } from '@apollo/client'; // Hook de Apollo Client para ejecutar mutations
import { LOGIN_USER } from '../services/mutations'; // Mutation GraphQL para login
import AuthService from '../services/auth'; // Servicio para guardar token y redireccionar
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userFormData, setUserFormData] = useState({
    username: '', // input que representa email
    password: '',
  });
  // const [username, setUsername] = useState(''); // input que representa email
  // const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ Hook de navegación para redirigir a otra ruta

  // Ejecutamos el mutation LOGIN_USER
  const [loginUser, {error: loginError}] = useMutation(LOGIN_USER);

  if (loginError) {
    console.log(JSON.stringify(loginError)); 
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario 

    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      event.stopPropagation(); // Detener si el formulario no es válido
      return;     
    }
    try {
      const { data } = await loginUser({
        variables: {
          username: userFormData.username, 
          password: userFormData.password, 
        },
      });

      const token = data?.login?.token;

      if (token) {
        AuthService.login(token); // Guardamos el token y redirigimos al home
        navigate('/dashboard'); // Redirigir a la ruta /dashboard después de iniciar sesión
      } else {
        throw new Error('No token returned from server');
      }

      setUserFormData({ username: '', password: '' }); // Limpiar el formulario
    } catch (err: any) {
      console.error('Login error:', err); // Imprimir error en consola
      setError('Response not successful: ' + err.message); // Mostrar mensaje legible
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-branding">
          <h1 className="brand-title">
            AGENDIFY<span>Plus</span>
          </h1>
        </div>

        <div className="contact-info">
          <p>✉️ <strong>hello@agendigy.com</strong></p>
          <p>🌐 <strong>www.agendigy.com</strong></p>
          <p>🏠 <strong>123 Anywhere St., Any City</strong></p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-logo">
            <img src="assets/logoagendify.png" alt="Agendify Logo" />
            <h1>Agendify<span>+</span></h1>
          </div>

          <h2>LOGIN TO YOUR ACCOUNT</h2>

          <form className="login-form" onSubmit={handleFormSubmit}>
            <label>Username :</label> {/* Aunque input dice 'username', se espera un email */}
            <input
              type="text"
              placeholder="Enter your Username"
              name="username"
              onChange={handleInputChange}
              value={userFormData.username}
              // onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
              // onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="login-footer">
              <button type="submit">LOGIN</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
