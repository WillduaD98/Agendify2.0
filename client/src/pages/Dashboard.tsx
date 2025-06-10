import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Asegúrate de tener este archivo

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Welcome to Agendify 📅</h1>
        <h3 className="dashboard-subtitle">Manage your time, empower your business.</h3>
        <p className="dashboard-description">
          Easily schedule, organize, and track your appointments with just a few clicks.
        </p>
        <div className="dashboard-buttons">
          <button onClick={() => navigate('/schedule')}>📅 View Schedule</button>
          <button onClick={() => navigate('/booking')}>➕ Book New Appointment</button>
          <button onClick={() => navigate('/clients')}>👥 View/Create Clients</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
