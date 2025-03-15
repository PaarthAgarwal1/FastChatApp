const express = require('express');
const cors = require('cors');
const cookieParse = require('cookie-parser');

require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRequestRoutes = require('./routes/freindRequestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const blockRoutes = require('./routes/blockRoutes');
const { app, server } = require('./config/socket');

connectDB();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParse());
const corsOptions = {
  origin: [process.env.CLIENT_URL], // added client url. k
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/friends', friendRequestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/blocked', blockRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})