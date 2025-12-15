import { io } from '../index';

io.on('connection', socket => {
  console.log('🟢 User connected');
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected');
  });
});

