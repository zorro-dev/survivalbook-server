const changeState = require('./changeState')
const getAll = require('./getAll')

module.exports = {
    '/forum/tracked/changeState': {...changeState,},
    '/forum/tracked/getAll': {...getAll,},
}