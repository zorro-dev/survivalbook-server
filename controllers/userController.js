require('dotenv').config()

const ApiError = require('../error/ApiError')
const {Account} = require('../models/models')

const jwt = require('jsonwebtoken')
const {promisify} = require("util")
const request = require("request")

const generateJwt = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_KEY,
    {expiresIn: '24h'})
}

const decodeFirebaseIdToken = async (firebaseIdToken) => {
  const rp = promisify(request);

  const googleSecurityKeys = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

  const response = await rp(googleSecurityKeys);
  const publicKeys = JSON.parse(response.body);

  const header64 = firebaseIdToken.split('.')[0];

  const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
  return jwt.verify(firebaseIdToken, publicKeys[header.kid], {algorithms: ['RS256']})
}

const getJwtPayload = (account) => {
  return {
    id: account.id,
    uid: account.uid,
    rights: account.rights,
    attributes: account.attributes
  }
}

class UserController {

  async authFirebaseUser(req, res, next) {
    const {firebaseIdToken} = req.body;

    const decoded = await decodeFirebaseIdToken(firebaseIdToken)

    console.log(decoded);

    const sign_in_provider = decoded.firebase.sign_in_provider
    const uid = decoded.user_id
    const iat = decoded.iat
    const exp = decoded.exp
    // TODO генерация имен
    const name = decoded.name ? decoded.name : "username"

    let account = await Account.findOne({where: {uid}})

    if (account) {
      const isNewProvider = !account.sign_in_providers.includes(sign_in_provider)
      if (isNewProvider) {
        account.sign_in_providers.push(sign_in_provider)
      }

      const updateResponse = await Account.update({sign_in_providers: account.sign_in_providers},
        {
          where: {id: account.id},
          returning: true
        })

      account = updateResponse[1][0]
    } else {
      const attributes = {
        picture: decoded.picture,
        email: decoded.email,
        name
      }

      const sign_in_providers = []
      sign_in_providers.push(sign_in_provider)

      const rights = []

      account = await Account.create({uid, attributes, rights, sign_in_providers})
    }

    const token = generateJwt(getJwtPayload(account))

    return res.json({
      token, account
    })
  }

  async check(req, res, next) {
    const id = req.auth.id

    const account = await Account.findOne({where: {id}})

    const token = generateJwt(getJwtPayload(account))

    return res.json({
      token, account
    })
  }
}

module.exports = new UserController()