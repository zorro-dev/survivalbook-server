const ApiError = require("../../error/ApiError");
const {ForumTheme} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {ForumMessage} = require("../../models/models");
const {LastReadMessage} = require("../../models/models");
const {TrackedTheme} = require("../../models/models");

class ThemeController {

    async changeState(req, res, next) {
        let {theme_id} = req.body

        theme_id = theme_id.toString()
        const user_id = req.user.id.toString()

        if (TextUtils.isEmpty(theme_id)) { return next(ApiError.REQUIRED_FIELD_EMPTY('theme_id')) }

        let trackedTheme = await TrackedTheme.findOne({where: {user_id, theme_id}});

        const theme = await ForumTheme.findOne({where: {id: theme_id}})

        if (!theme) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumTheme'))

        if (!trackedTheme) {
            await TrackedTheme.create({user_id, theme_id});
            return res.json({
                success: true,
                is_tracked: true,
                theme
            })
        } else {
            const trackedTheme = await TrackedTheme.findOne({where: {user_id, theme_id}});
            await trackedTheme.destroy()

            return res.json({
                success: true,
                is_tracked: false,
                theme
            })
        }
    }

    async getAll(req, res, next) {
        const {chunk} = req.query

        if (TextUtils.isEmpty(chunk)) { return next(ApiError.REQUIRED_FIELD_EMPTY('chunk')) }

        const user_id = req.user.id.toString()

        const chunk_size = 10

        let trackedThemes = await TrackedTheme.findAndCountAll({where : {user_id}, offset: chunk_size * Number.parseInt(chunk) - chunk_size, limit: 10});

        for (let i = 0; i < trackedThemes.rows.length; i ++) {
            let trackedTheme = trackedThemes.rows[i]

            const theme_id = trackedTheme.theme_id.toString()

            const lastReadMessage = await LastReadMessage.findOne({where: {user_id, theme_id}})

            let lastRead_message_id = 0

            if (lastReadMessage) lastRead_message_id = Number.parseInt(lastReadMessage.message_id)

            const themeMessages = await ForumMessage.findAndCountAll({where: {theme_id}, offset: 1, limit: 1})
            const notReadMessages = themeMessages.count - lastRead_message_id

            let answeredMessages = await ForumMessage.findAll({where: {theme_id, answer_to_user: user_id}})

            answeredMessages = answeredMessages.filter(message => message.id > lastRead_message_id && message.user_id !== user_id)

            trackedTheme = trackedTheme.toJSON()
            trackedTheme.last_read_message_id = lastRead_message_id
            trackedTheme.not_read_message = notReadMessages
            trackedTheme.answered_messages = answeredMessages.length

            trackedThemes.rows[i] = trackedTheme
        }

        return res.json({
            success: true,
            trackedThemes
        })
    }
}

module.exports = new ThemeController()