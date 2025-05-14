import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('Szerver fut');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend fut: http://localhost:${PORT}`);
});