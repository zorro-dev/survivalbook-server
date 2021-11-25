const ApiError = require('../error/ApiError')

module.exports = function (err, req, res, next) {
    console.log("error : " + err)
    if (err instanceof ApiError) {
        console.log("errorCode : " + err.errorCode)
        if (err.errorCode) {
            return res.status(err.status).json({error : err.errorCode, message : err.message})
        } else {
            return res.status(err.status).json({message : err.message})
        }
    }
    return res.status(500).json(ApiError.UNEXPECTED_ERROR(err))
}