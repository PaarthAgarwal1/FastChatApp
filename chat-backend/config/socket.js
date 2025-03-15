const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL], // added client url. k
    }
});

const userSocketMap = {};

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
    console.log("A user is connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", () => {
        console.log("A user is disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, server, app, getReceiverSocketId };
