const ApiError = require("../../error/ApiError");
const {ForumTheme} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {ForumLastReadMessage} = require("../../models/models");
const {ForumMessage} = require("../../models/models");
const {LastReadMessage} = require("../../models/models");
const {ForumTrackedTheme} = require("../../models/models");

class ThemeController {

  async changeState(req, res, next) {
    let {theme_id} = req.body

    if (TextUtils.isEmpty(theme_id)) {
      return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id'))
    }

    const forumThemeId = theme_id
    const accountId = req.auth.id

    let trackedTheme = await ForumTrackedTheme.findOne({where: {accountId, forumThemeId}});

    const theme = await ForumTheme.findOne({where: {id: theme_id}})

    if (!theme) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))

    if (!trackedTheme) {
      await ForumTrackedTheme.create({accountId, forumThemeId});
      return res.json({
        is_tracked: true,
        trackedTheme
      })
    } else {
      const trackedTheme = await ForumTrackedTheme.findOne({where: {accountId, forumThemeId}});
      await trackedTheme.destroy()

      return res.json({
        is_tracked: false,
        trackedTheme
      })
    }
  }

  async getAll(req, res, next) {
    const accountId = req.auth.id

    let trackedThemes = await ForumTrackedTheme.findAll({where: {accountId}});

    for (let i = 0; i < trackedThemes.length; i++) {
      let trackedTheme = trackedThemes[i]

      const forumThemeId = trackedTheme.forumThemeId

      const lastReadMessage = await ForumLastReadMessage.findOne({where: {accountId, forumThemeId}})

      let lastRead_message_id = 0
      if (lastReadMessage) lastRead_message_id = lastReadMessage.toJSON().forumMessageId

      const themeMessages = await ForumMessage.findAndCountAll({where: {forumThemeId}, offset: 1, limit: 1})
      const notReadMessages = themeMessages.count - lastRead_message_id

      let answeredMessages = await ForumMessage.findAll({where: {forumThemeId, answer_to_account: accountId}})
      answeredMessages = answeredMessages.filter(message => message.toJSON().id > lastRead_message_id && message.toJSON().accountId !== accountId)

      trackedTheme = trackedTheme.toJSON()
      trackedTheme.last_read_message_id = lastRead_message_id
      trackedTheme.not_read_message = notReadMessages
      trackedTheme.answered_messages = answeredMessages.length

      trackedThemes[i] = trackedTheme
    }

    return res.json(trackedThemes)
  }
}

module.exports = new ThemeController()