import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError('Hibás felhasználónév vagy jelszó!');
    }
  };

  return (
    <div className="container my-5">
      <h2>Bejelentkezés</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Felhasználónév"
        />
        <input
          className="form-control mb-2"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Jelszó"
        />
        <button className="btn btn-primary" type="submit">Bejelentkezés</button>
        {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
      </form>
    </div>
  );
}