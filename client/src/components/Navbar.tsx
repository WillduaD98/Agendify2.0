import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Navbar.css';
import auth from '../services/auth';

const Navbar: React.FC = () => {
  const [_loginCheck, setLoginCheck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Estado del menú hamburguesa

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkLogin();
  }, []);

  // Cierra el menú cuando cambias de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Hide Navbar on login page
  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Agendify</h1>
      </div>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        {location.pathname !== '/dashboard' && (
          <Link to="/dashboard">Home</Link>
        )}
        <Link to="/schedule">Schedule</Link>
        <Link to="/booking">Book</Link>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            auth.logout();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
      <div className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
