const create = require('./create')
const update = require('./update')
const remove = require('./remove')
const getOne = require('./getOne')

module.exports = {
    '/forum/part/create': {...create,},
    '/forum/part/update': {...update,},
    '/forum/part/remove': {...remove,},
    '/forum/part/getOne/{id}': {...getOne,},
}