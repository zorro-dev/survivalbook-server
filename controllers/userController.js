require('dotenv').config()

const ApiError = require('../error/ApiError')
const {User} = require('../models/models')
const jwt = require('jsonwebtoken')
const {AuthType} = require("../models/constants");

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.JWT_KEY,
        {expiresIn: '24h'})
}

const validateRegistration = async (uid, email) => {
    if (!uid) return ApiError.REQUIRED_FIELD_EMPTY('uid')
    if (!email) return ApiError.REQUIRED_FIELD_EMPTY('email')
    const candidate = await User.findOne({where: {email}})
    if (candidate) return ApiError.EMAIL_ALREADY_EXIST()
}

const validateLogin = (uid, email) => {
    if (!uid) return ApiError.REQUIRED_FIELD_EMPTY('uid')
    if (!email) return ApiError.REQUIRED_FIELD_EMPTY('email')
}

class UserController {

    async registration(req, res, next) {
        const {uid, email} = req.body;

        const validateError = await validateRegistration(uid, email)
        if (validateError) return next(validateError)

        const user = await User.create({uid, email})
        const token = generateJwt(user.id, email, user.role)

        return res.json({token: token})
    }

    async login(req, res, next) {
        const {uid, email, auth_type} = req.body;

        const validateError = validateLogin(uid, email)
        if (validateError) return next(validateError)

        let user = await User.findOne({where: {email}})

        if (!user) {
            if (auth_type === AuthType.Google) {
                user = await User.create({uid, email})
            } else {
                return next(ApiError.USER_WITH_SOME_EMAIL_NOT_FOUND())
            }
        }

        if (user.uid !== uid) return next(ApiError.INVALID_UID_OR_EMAIL())

        const token = generateJwt(user.id, email, user.role)

        return res.json({token: token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token: token})
    }
}

module.exports = new UserController()