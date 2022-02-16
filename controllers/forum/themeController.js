require('dotenv').config()
const ApiError = require("../../error/ApiError");
const {ForumTheme} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {Account} = require("../../models/models");
const {ForumLastReadMessage} = require("../../models/models");
const {User} = require("../../models/models");
const {LastReadMessage} = require("../../models/models");
const {UserRole} = require("../../models/constants");
const {ForumMessage} = require("../../models/models");
const {Op} = require("sequelize");

class ThemeController {

  async create(req, res, next) {
    const {name, part_id} = req.body

    if (TextUtils.isEmpty(name)) return next(ApiError.REQUIRED_FIELD_EMPTY('name'))
    if (TextUtils.isEmpty(part_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('part_id'))

    const theme = await ForumTheme.create({name, forumPartId: part_id});

    return res.json(theme)
  }

  async update(req, res, next) {
    let {id, name, part_id} = req.body

    if (TextUtils.isEmpty(id)) return next(ApiError.REQUIRED_FIELD_EMPTY('id'))

    let theme = await ForumTheme.findOne({where: {id}});

    if (!theme) {
      return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))
    } else if (TextUtils.isEmpty(name)) name = theme.name
    else if (TextUtils.isEmpty(part_id)) part_id = theme.forumPartId

    await ForumTheme.update({name, forumPartId: part_id}, {where: {id}});

    theme = await ForumTheme.findOne({where: {id}});

    return res.json(theme)
  }

  async remove(req, res, next) {
    const {id} = req.body

    if (TextUtils.isEmpty(id) && !Number.isInteger(id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('id'))
    }

    const theme = await ForumTheme.findOne({where: {id}});

    if (!theme) {
      return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))
    } else {
      await theme.destroy()
    }

    return res.json({
      success: true
    })
  }

  async getAll(req, res, next) {
    let themes = await ForumTheme.findAll();

    return res.json(themes)
  }

  async getMessages(req, res, next) {
    let {chunk, theme_id} = req.query

    if (TextUtils.isEmpty(theme_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    if (TextUtils.isEmpty(chunk)) return next(ApiError.REQUIRED_FIELD_EMPTY('chunk'))

    let theme = await ForumTheme.findOne({where: {id: theme_id}});

    if (!theme) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))

    const chunk_size = 10;

    const messageResponse = await ForumMessage.findAndCountAll({
      where: {forumThemeId : theme_id},
      offset: chunk_size * Number.parseInt(chunk) - chunk_size,
      limit: 10
    })

    let messages = messageResponse.rows

    const accountIds = []
    const answerToMessageIds = []

    messages.map((m) => {
      const message = m.toJSON()
      accountIds.push(message.accountId)
      if (message.answer_to) {
        answerToMessageIds.push(message.answer_to)
      }
    })

    const accountsResponse = await Account.findAll({
      where: {
        id: {
          [Op.or]: accountIds
        }
      },
      attributes: { exclude: ['sign_in_providers'] }
    })

    const answerMessagesResponse = await ForumMessage.findAll({
      where: {
        id: {
          [Op.or]: answerToMessageIds
        }
      }
    })

    const answerMessages = JSON.parse(JSON.stringify(answerMessagesResponse))
    const accounts = JSON.parse(JSON.stringify(accountsResponse))

    answerMessages.map(message => messages.push(message))

    messages = messages.filter((value, index, self) =>
      index === self.findIndex((t) => (
        JSON.stringify(t) === JSON.stringify(value)
      ))
    )

    return res.json({
      messages,
      accounts,
    })

    // if (req.user) {
    //   const user_id = req.user.id.toString()
    //   const lastReadMessage = await LastReadMessage.findOne({where: {user_id, theme_id}})
    //
    //   let last_read_message_id = 0
    //   if (lastReadMessage) last_read_message_id = Number.parseInt(lastReadMessage.message_id)
    //
    //   return res.json({
    //     messages,
    //     accounts,
    //     //last_read_message_id
    //   })
    // } else {
    //   return res.json({
    //     list
    //   })
    // }
  }

  async sendMessage(req, res, next) {
    const {theme_id, text, answer_to} = req.body

    if (TextUtils.isEmpty(text)) return next(ApiError.REQUIRED_FIELD_EMPTY('text'))
    if (TextUtils.isEmpty(theme_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))

    const accountId = req.auth.id
    const forumThemeId = theme_id

    let answer_to_account

    if (answer_to) {
      const answerMessage = await ForumMessage.findOne({where: {id: answer_to}})
      if (answerMessage) answer_to_account = answerMessage.toJSON().accountId
    }

    const message = await ForumMessage.create({
      accountId,
      text,
      answer_to,
      answer_to_account,
      is_removed: false,
      forumThemeId
    });

    return res.json(message)
  }

  async removeMessage(req, res, next) {
    let {message_id, theme_id} = req.body

    if (TextUtils.isEmpty(message_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('message_id'))
    if (TextUtils.isEmpty(theme_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))

    const accountId = req.auth.id
    const forumThemeId = theme_id

    let message = await ForumMessage.findOne({where: {id: message_id, forumThemeId}})

    if (!message) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumMessage'))
    // TODO добавить проверку на права модератора
    if (message.accountId !== accountId /*|| req.user.role !== UserRole.Admin*/) return next(ApiError.NOT_ACCESS())

    await ForumMessage.update({is_removed: true}, {where: {id: message_id, forumThemeId}})

    message = await ForumMessage.findOne({where: {id: message_id, forumThemeId}})

    return res.json(message)
  }

  async setLastReadMessage(req, res, next) {
    let {theme_id, message_id} = req.body

    if (TextUtils.isEmpty(message_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('message_id'))
    if (TextUtils.isEmpty(theme_id)) return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))

    const accountId = req.auth.id
    const forumThemeId = theme_id
    const forumMessageId = message_id

    let lastReadMessage = await ForumLastReadMessage.findOne({where: {accountId, forumThemeId}});

    if (!lastReadMessage) {
      await ForumLastReadMessage.create({accountId, forumThemeId, forumMessageId});
    } else {
      await ForumLastReadMessage.update({forumMessageId}, {where: {accountId, forumThemeId}});
    }

    lastReadMessage = await ForumLastReadMessage.findOne({where: {accountId, forumThemeId}});

    return res.json(lastReadMessage)
  }

}

module.exports = new ThemeController()