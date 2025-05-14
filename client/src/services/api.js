import axios from 'axios';

const API = 'http://localhost:5000/api/appointments';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const getAppointments = () => axios.get(API, getAuthConfig());
export const createAppointment = (data) => axios.post(API, data);
export const deleteAppointment = (id) => axios.delete(`${API}/${id}`, getAuthConfig());

// Login endpoint
export const login = async (username, password) => {
  const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
  localStorage.setItem('token', res.data.token);
};