require('dotenv').config()
const ApiError = require("../error/ApiError")
const jwt = require('jsonwebtoken')
const {User} = require("../models/models");
const {UserRole} = require("../models/constants");
const {promisify} = require("util")
const request = require("request")

const roleAccessTable = new Map()
roleAccessTable.set(UserRole.Visitor, 0);
roleAccessTable.set(UserRole.User, 1);
roleAccessTable.set(UserRole.Admin, 10);

module.exports = function (role) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    } else
      try {
        const token = req.headers.authorization.split(' ')[1]
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

        if (user) {
          let roleAccessInReq = roleAccessTable.get(user.role)
          if (!roleAccessInReq) roleAccessInReq = 0;

          const roleAccessNeeded = roleAccessTable.get(role)

          console.log(roleAccessInReq)
          console.log(roleAccessNeeded)

          if (roleAccessInReq < roleAccessNeeded) {
            return res.json(ApiError.NOT_ACCESS())
          }

          req.user = user
        }

        next()
      } catch (e) {
      console.log(e)
        if (role === UserRole.Visitor) {
          next()
        } else {
          return res.json(ApiError.NOT_AUTH())
        }
      }
  }
}


