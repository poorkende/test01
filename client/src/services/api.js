import axios from 'axios';

const API = 'http://localhost:5000/api/appointments';

export const createAppointment = (data) => axios.post(API, data);

// Publikus lekérdezés (CalendarFormhoz)
export const getPublicAppointments = () => axios.get(`${API}/public`);

// Admin lekérdezés (token kell)
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const getAppointments = () => axios.get(API, getAuthConfig());
export const deleteAppointment = (id) => axios.delete(`${API}/${id}`, getAuthConfig());

export const login = async (username, password) => {
  const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
  localStorage.setItem('token', res.data.token);
};