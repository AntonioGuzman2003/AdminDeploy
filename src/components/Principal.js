import React from "react";
import "./Principal.css";
import logo from "../assets/logo2.png"; 
import { Link, useNavigate } from 'react-router-dom';
import './fondo.css';
import fondoVideo from '../video/fondo.mp4';

function Principal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');

    navigate('/');
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="top-bar">
          <button onClick={handleLogout} className="btn-sesion btn-3 my-3" style={{ position: 'absolute', top: '10px', left: '10px' }}>
            Cerrar Sesión
          </button>
        </div>

        <div className="logo">
          <img src={logo} alt="Logo" className="logoimage" />
        </div>

        <div className="admin-panel">
          <h1>Buscam</h1>
          <h2>Administrar</h2>
          <div className="contenedor">
            <Link to="/Usuario" className="btn btn-3">Usuarios</Link>
            <Link to="/Anuncio" className="btn btn-3">Productos</Link>
            <Link to="/Reporte" className="btn btn-3">Reporte</Link>
          </div>
        </div>
      </div>
      <video muted autoPlay loop className="background-video">
        <source src={fondoVideo} type="video/mp4" />
      </video>
      <div className="capa"></div>
    </div>
  );
}

export default Principal;
