require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path');
const server = require('http').createServer(app);

const PORT = process.env.PORT || 5000

const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(express.static(path.join(__dirname, 'public')));

// обработка ошибок последний middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        // для обновления базы данных
        await sequelize.sync({alter: true})
        //await sequelize.sync()
        server.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

module.exports = {
    server
}