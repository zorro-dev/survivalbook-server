const create = require('./create')
const update = require('./update')
const remove = require('./remove')
const sendMessage = require('./sendMessage')
const removeMessage = require('./removeMessage')
const getMessages = require('./getMessages')
const setLastMessage = require('./setLastMessage')

module.exports = {
    '/forum/theme/create': {...create,},
    '/forum/theme/update': {...update,},
    '/forum/theme/remove': {...remove,},
    '/forum/sendMessage': {...sendMessage,},
    '/forum/removeMessage': {...removeMessage,},
    '/forum/getMessages': {...getMessages,},
    '/forum/theme/setLastMessage': {...setLastMessage,},
}