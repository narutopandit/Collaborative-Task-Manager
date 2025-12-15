import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from '../config/db';
import authRoutes from './routes/auth/routes';
import taskRoutes from './routes/task/routes';


const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }
});

import './sockets';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

connectDB();

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});