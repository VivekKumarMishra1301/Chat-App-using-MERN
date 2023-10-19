const express = require('express');
const app = express();
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB = require('./dbConnect/db.js');
const userRouter = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const chatRoutes=require('./routes/chatRoutes')
dotenv.config();
connectDB();

app.use(express.json());//to use the json data

const { chats } = require("./data/data");
// console.log(chats);
app.use(cors());
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

const PORT = process.env.PORT || 5000;

app.listen(5000, function () {
    console.log(`server is on at port ${PORT}`);
});