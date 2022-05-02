const ApiError = require("../../error/ApiError");
const {ForumPart} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {ForumTheme} = require("../../models/models");


class PartController {

    async create(req, res, next) {
        const {name, icon_url, group_id} = req.body

        if (TextUtils.isEmpty(name)) { return next(ApiError.REQUIRED_FIELD_EMPTY('name')) }

        const part = await ForumPart.create({name, icon_url, forumGroupId: group_id});

        return res.json(part)
    }

    async update(req, res, next) {
        let {id, name, icon_url, group_id} = req.body

        if (TextUtils.isEmpty(id)) { return next(ApiError.REQUIRED_FIELD_EMPTY('id')) }

        let part = await ForumPart.findOne({where: {id}});

        if (!part) {
            return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumPart'))
        }
        else if (TextUtils.isEmpty(name)) name = part.name
        else if (TextUtils.isEmpty(icon_url)) icon_url = part.icon_url
        else if (TextUtils.isEmpty(group_id)) group_id = part.forumGroupId

        await ForumPart.update({name, icon_url, forumGroupId: group_id}, {where: {id}});

        part = await ForumPart.findOne({where: {id}});

        return res.json(part)
    }

    async remove(req, res, next) {
        const {id} = req.body

        if (TextUtils.isEmpty(id) && !Number.isInteger(id)) { return next(ApiError.REQUIRED_FIELD_EMPTY('id')) }

        const part = await ForumPart.findOne({where: {id}});

        if (!part) {
            return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumPart'))
        } else {
            await part.destroy()
        }

        return res.json({
            success: true
        })
    }

    async getAll(req, res, next) {
        let parts = await ForumPart.findAll();

        return res.json({
            parts
        })
    }

}

module.exports = new PartController()