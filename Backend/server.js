const express = require('express');
const app = express();
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB = require('./dbConnect/db.js');
const userRouter = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
dotenv.config();
connectDB();

app.use(express.json());//to use the json data

const { chats } = require("./data/data");
// console.log(chats);
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173' // Update with your client's origin
// }));
app.get('/', (req, res) => {
    res.send("API is running fine");
});

// app.get('/api/chat', (req, res) => {
//     res.send(chats);
// });
// app.get('/api/chat/:id', (req, res) => {
//     // console.log(req.params.id);
//     const singleChat = chats.find((chat) => chat._id === req.params.id);
//     res.send(singleChat);
// });

// app.use(notFound);
// app.use(errorHandler);

app.use('/api/user', userRouter);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
const PORT = process.env.PORT || 5000;

const server=app.listen(5000, function () {
    console.log(`server is on at port ${PORT}`);
});
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // origin: 'https://localhost:5000',
    }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
      console.log(chat.users);
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageRecieved);
      console.log(user._id);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});