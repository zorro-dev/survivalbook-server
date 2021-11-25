require('dotenv').config()
const ApiError = require("../../error/ApiError");
const {ForumTheme} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {User} = require("../../models/models");
const {LastReadMessage} = require("../../models/models");
const {UserRole} = require("../../models/constants");
const {ForumMessage} = require("../../models/models");

class ThemeController {

  async create(req, res, next) {
    const {name, part_id} = req.body

    if (TextUtils.isEmpty(name)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('name'))
    }
    if (TextUtils.isEmpty(part_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('part_id'))
    }

    const theme = await ForumTheme.create({name, part_id});

    return res.json({
      success: true,
      theme
    })
  }

  async update(req, res, next) {
    let {id, name, part_id} = req.body

    if (TextUtils.isEmpty(id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('id'))
    }

    let theme = await ForumTheme.findOne({where: {id}});

    if (!theme) {
      return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumPart'))
    } else if (TextUtils.isEmpty(name)) name = theme.name
    else if (TextUtils.isEmpty(part_id)) part_id = theme.part_id

    await ForumTheme.update({name, part_id}, {where: {id}});

    theme = await ForumTheme.findOne({where: {id}});

    return res.json({
      success: true,
      theme
    })
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


  async getMessages(req, res, next) {
    let {chunk, theme_id} = req.query

    if (TextUtils.isEmpty(theme_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    }
    if (TextUtils.isEmpty(chunk)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('chunk'))
    }

    theme_id = theme_id.toString()

    let theme = await ForumTheme.findOne({where: {id: theme_id}});

    if (!theme) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))

    const chunk_size = 10;

    const messages = await ForumMessage.findAndCountAll({
      where: {theme_id},
      offset: chunk_size * Number.parseInt(chunk) - chunk_size,
      limit: 10
    })

    const list = JSON.parse(JSON.stringify(messages.rows))

    // получаем информацию о авторах
    for (let i = 0; i < list.length; i++) {
      const message = list[i]

      const user = await User.findOne({where: {id: Number.parseInt(message.user_id)}})
      message.avatar_url = user.avatar_url
      message.author_name = user.email
    }

    console.log("user : " + req.user)

    if (req.user) {
      const user_id = req.user.id.toString()
      const lastReadMessage = await LastReadMessage.findOne({where: {user_id, theme_id}})

      let last_read_message_id = 0
      if (lastReadMessage) last_read_message_id = Number.parseInt(lastReadMessage.message_id)

      return res.json({
        list,
        last_read_message_id
      })
    } else {
      return res.json({
        list
      })
    }
  }

  async sendMessage(req, res, next) {
    const {theme_id, text, answer_to} = req.body

    if (TextUtils.isEmpty(text)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('text'))
    }
    if (TextUtils.isEmpty(theme_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    }

    let answer_to_user = null;

    if (answer_to) {
      const answerToMessage = await ForumMessage.findOne({where: {id: answer_to, theme_id: theme_id.toString()}});
      answer_to_user = parseInt(answerToMessage.user_id);

    }

    let message = await ForumMessage.create({
      user_id: req.user.id,
      text,
      answer_to,
      answer_to_user,
      is_removed: false,
      theme_id
    });

    return res.json({
      success: true,
      message
    })
  }

  async removeMessage(req, res, next) {
    let {message_id, theme_id} = req.body

    if (TextUtils.isEmpty(message_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('message_id'))
    }
    if (TextUtils.isEmpty(theme_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    }

    message_id = message_id.toString()
    theme_id = theme_id.toString()

    let message = await ForumMessage.findOne({where: {id: message_id, theme_id: theme_id}})

    if (!message) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumMessage'))
    if (message.user_id !== req.user.id && req.user.role !== UserRole.Admin) return next(ApiError.NOT_ACCESS())

    await ForumMessage.update({is_removed: true}, {where: {id: message_id, theme_id}})

    message = await ForumMessage.findOne({where: {id: message_id, theme_id}})

    return res.json({
      success: true,
      message
    })
  }

  async setLastReadMessage(req, res, next) {
    let {theme_id, message_id} = req.body

    const user_id = req.user.id.toString()
    theme_id = theme_id.toString()
    message_id = message_id.toString()

    if (TextUtils.isEmpty(message_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('message_id'))
    }
    if (TextUtils.isEmpty(theme_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    }

    const lastReadMessage = await LastReadMessage.findOne({where: {user_id, theme_id}});

    if (!lastReadMessage) {
      await LastReadMessage.create({user_id, theme_id, message_id});
    } else {
      await LastReadMessage.update({message_id}, {where: {user_id, theme_id}});
    }


    return res.json({
      success: true
    })
  }


}

module.exports = new ThemeController()