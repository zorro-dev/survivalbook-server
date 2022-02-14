require('dotenv').config()
const ApiError = require("../error/ApiError")
const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // TODO добавить проверку на истечение токена

    req.auth = {
      id: decoded.id,
      uid: decoded.uid,
      rights: decoded.rights
    }

    next()
  } catch (e) {
    return res.json(ApiError.NOT_AUTH())
  }
}