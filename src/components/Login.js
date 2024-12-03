import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; 
import { get, ref, child } from "firebase/database";
import { db, auth } from '../firebaseConfig/firebase';
import fondoVideo from '../video/fondo.mp4';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/Principal');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const dbRef = ref(db);

    try {
      const snapshot = await get(child(dbRef, 'cuentaAdmin'));

      if (snapshot.exists()) {
        const admins = snapshot.val();

        let found = false;
        for (const adminId in admins) {
          const admin = admins[adminId];

          if (admin.email === email && admin.password === password) {
            // Verificar si el correo está verificado
            const user = await signInWithEmailAndPassword(auth, email, password);
            if (user.user.emailVerified) {
              localStorage.setItem('token', 'userToken');
              navigate('/Principal');
              found = true;
              break;
            } else {
              setError('Debes verificar tu correo electrónico.');
            }
          }
        }

        if (!found) {
          setError('Credenciales incorrectas. Intenta de nuevo.');
        }
      } else {
        setError('No se encontró la cuenta de administrador.');
      }
    } catch (err) {
      setError('Error al conectar con la base de datos.');
    }
  };

  return (
    <div className="login-rich-content">
      <div className="login-form">
        <h1>BIENVENIDO ADMINISTRADOR</h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="login-options">
            <button type="submit" className="login-btn">Ingresar</button>
          </div>
        </form>

        <div className="register-link">
          <p>No tienes una cuenta? <a href="/register">Regístrate aquí</a></p>
        </div>
      </div>

      <video muted autoPlay loop>
        <source src={fondoVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default Login;
