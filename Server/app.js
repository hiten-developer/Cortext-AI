const express = require("express");
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes')
const app = express();

// MiddleWares
app.use(express.json());

// Routes
app.use('/',authRoutes);
app.use('/',userRoutes);
app.use('/',conversationRoutes)
app.use('/',messageRoutes)

module.exports = app;
