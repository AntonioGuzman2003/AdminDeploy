import React, { useState } from 'react';
import { ref, set } from 'firebase/database'; 
import { db, auth } from '../firebaseConfig/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const RegisterAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminId = Date.now();
      await set(ref(db, `cuentaAdmin/${adminId}`), {
        email,
        password,
        isVerified: false,  
      });

      await sendEmailVerification(user);
      alert('Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.');

      navigate('/');
    } catch (err) {
      console.error('Error registrando al administrador:', err);
      setError('Hubo un problema al registrar el administrador.');
    }
  };

  return (
    <div className="login-rich-content">
      <div className="capa"></div>

      <div className="login-form">
        <h1>Registrar Administrador</h1>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Repetir Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Registrar</button>
        </form>

        <div className="login-link">
          <p>Ingresar <a href="/">Volver a Login</a></p>
        </div>
      </div>

      <video className="background-video" muted autoPlay loop>
        <source src={require('../video/fondo.mp4')} type="video/mp4" />
      </video>
    </div>
  );
};

export default RegisterAdmin;
