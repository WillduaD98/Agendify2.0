import { useState, ChangeEvent, FormEvent } from 'react';
import './Login.css';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../services/mutations';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logoagendify.png';

const Login = () => {
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [loginUser, { error: loginError }] = useMutation(LOGIN_USER);

  if (loginError) {
    console.log(JSON.stringify(loginError));
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      event.stopPropagation();
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
        localStorage.setItem('token', token); // ✅ Guarda el token con clave "token"
        navigate('/dashboard');
      } else {
        throw new Error('No token returned from server');
      }

      setUserFormData({ username: '', password: '' });
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Response not successful: ' + err.message);
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
            <img src={logo} alt="Agendify Logo" />
            <h1>Agendify<span>+</span></h1>
          </div>

          <h2>LOGIN TO YOUR ACCOUNT</h2>

          <form className="login-form" onSubmit={handleFormSubmit}>
            <label>Username :</label>
            <input
              type="text"
              placeholder="Enter your Username"
              name="username"
              onChange={handleInputChange}
              value={userFormData.username}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
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
