const registration = require('./registration')
const login = require('./login')
const check = require('./check')

module.exports = {

    '/user/registration': {...registration,},
    '/user/login': {...login,},
    '/user/auth': {...check,},
    // '/todos/{id}':{
    //     ...getTodo,
    //     ...updateTodo,
    //     ...deleteTodo
    // }

}