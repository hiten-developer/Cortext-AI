const express = require("express");
const app = express();
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors')

app.use(cors());

// MiddleWares
app.use(express.json());

// Routes
app.use('/',authRoutes);
app.use('/',userRoutes);
app.use('/',conversationRoutes)
app.use('/',messageRoutes)
app.use('/',chatRoutes)

module.exports = app;
