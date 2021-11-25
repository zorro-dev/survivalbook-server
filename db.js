require('dotenv').config()
const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DEBUG ? process.env.DB_NAME_DEBUG : process.env.DB_NAME,
    process.env.DEBUG ? process.env.DB_USER_DEBUG : process.env.DB_USER,
    process.env.DEBUG ? process.env.DB_PASSWORD_DEBUG : process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DEBUG ? process.env.DB_HOST_DEBUG : process.env.DB_HOST,
        port: process.env.DEBUG ? process.env.DB_PORT_DEBUG : process.env.DB_PORT,
        dialectOptions: process.env.DEBUG ? null : {
            ssl: {
                rejectUnauthorized: false, // very important
            }
        }
    },
)