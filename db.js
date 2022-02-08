require('dotenv').config()
const {Sequelize} = require('sequelize')

const isDebug = process.env.USE_DEBUG_DATABASE === 'true'
const dbName = isDebug ? process.env.DB_NAME_DEBUG : process.env.DB_NAME
const dbUser = isDebug ? process.env.DB_USER_DEBUG : process.env.DB_USER
const dbPassword = isDebug ? process.env.DB_PASSWORD_DEBUG : process.env.DB_PASSWORD

const host = isDebug ? process.env.DB_HOST_DEBUG : process.env.DB_HOST
const port = isDebug ? process.env.DB_PORT_DEBUG : process.env.DB_PORT

if (!isDebug) {
  console.log("*******************************************")
  console.log("*    Connected to production database     *")
  console.log("*******************************************")
  console.log("")
}
console.log("Database name - " + dbName)

module.exports = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    dialect: 'postgres',
    host,
    port,
    dialectOptions: isDebug ? null : {
      ssl: {
        rejectUnauthorized: false, // very important
      }
    },
    logging: false
  }
)