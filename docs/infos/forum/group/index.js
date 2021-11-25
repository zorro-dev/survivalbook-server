// const registration = require('./registration')
// const login = require('./login')
const create = require('./create')
const update = require('./update')
const remove = require('./remove')
const getAll = require('./getAll')

module.exports = {
    '/forum/group/create': {...create,},
    '/forum/group/update': {...update,},
    '/forum/group/remove': {...remove,},
    '/forum/group/getAll': {...getAll,},
}