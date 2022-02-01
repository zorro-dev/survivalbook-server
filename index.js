require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require("./models/models")
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');
const path = require('path');


const PORT = process.env.PORT || 5000

if (process.env.DEBUG) console.log("=============DEBUG MODE===========")
console.log("Connected to Database : " + (process.env.DEBUG ? process.env.DB_NAME_DEBUG : process.env.DB_NAME))

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs));
app.use(express.static(path.join(__dirname, 'public')));

// обработка ошибок последний middleware
app.use(errorHandler)

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

let numUsers = 0;

io.on('connection', (socket) => {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});