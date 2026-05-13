const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this for production
        methods: ["GET", "POST"]
    }
});

// Store connected users to send targeted notifications
const users = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        users.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
        for (const [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                users.delete(userId);
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

// Endpoint for Laravel backend to send notifications
app.post('/send-notification', (req, res) => {
    const { user_id, title, message, type } = req.body;

    if (!user_id || !message) {
        return res.status(400).json({ error: 'Missing user_id or message' });
    }

    const socketId = users.get(user_id.toString());
    const payload = { title, message, type: type || 'info', timestamp: new Date() };

    if (socketId) {
        io.to(socketId).emit('notification', payload);
        return res.json({ success: true, message: 'Notification sent to user' });
    } else {
        // Option: emit to a general room or just return sent: false if user offline
        return res.json({ success: false, message: 'User not connected' });
    }
});

// Endpoint for broadcasting to all users
app.post('/broadcast', (req, res) => {
    const { title, message, type } = req.body;
    io.emit('notification', { title, message, type: type || 'info', timestamp: new Date() });
    res.json({ success: true, message: 'Broadcast sent' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Notification server running on port ${PORT}`);
});
