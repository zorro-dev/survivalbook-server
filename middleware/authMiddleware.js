require('dotenv').config()
const ApiError = require("../error/ApiError")
const jwt = require('jsonwebtoken')
const {User} = require("../models/models");
const {promisify} = require("util")
const request = require("request")

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.json(ApiError.NOT_AUTH())

        const rp = promisify(request);

        const response = await rp('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
        const publicKeys = JSON.parse(response.body);

        const header64 = token.split('.')[0];
        const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
        const decoded = jwt.verify(token, publicKeys[header.kid], {algorithms: ['RS256']});

        const user = await User.findOne({
            where: {
                uid: decoded.user_id,
                email : decoded.email
            }
        })

        req.user = user

        next()
    } catch (e) {
        return res.json(ApiError.NOT_AUTH())
    }
}