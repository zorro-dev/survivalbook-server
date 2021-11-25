// const registration = require('./registration')
// const login = require('./login')
const group = require('./group')
const part = require('./part')
const theme = require('./theme')
const tracked = require('./tracked')

module.exports = {
    ...group,
    ...part,
    ...theme,
    ...tracked,
    // '/user/login':{ ...login, },
    // '/user/auth':{ ...check, },
    // '/todos/{id}':{
    //     ...getTodo,
    //     ...updateTodo,
    //     ...deleteTodo
    // }
}