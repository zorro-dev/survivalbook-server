const ApiError = require("../../error/ApiError");
const {ForumGroup} = require("../../models/models");
const TextUtils = require('../../utils/TextUtils')
const {ForumPart} = require("../../models/models");


class GroupController {

    async create(req, res, next) {
        const {name} = req.body

        if (TextUtils.isEmpty(name)) { return next(ApiError.REQUIRED_FIELD_EMPTY('name')) }

        const group = await ForumGroup.create({name});

        return res.json(group)
    }

    async update(req, res, next) {
        const {id, name} = req.body

        if (TextUtils.isEmpty(id)) { return next(ApiError.REQUIRED_FIELD_EMPTY('id')) }
        if (TextUtils.isEmpty(name)) { return next(ApiError.REQUIRED_FIELD_EMPTY('name')) }

        await ForumGroup.update({name}, {where: {id}});
        const group = await ForumGroup.findOne({where: {id}});

        return res.json(group)
    }

    async remove(req, res, next) {
        const {id} = req.body

        if (TextUtils.isEmpty(id) && !Number.isInteger(id)) { return next(ApiError.REQUIRED_FIELD_EMPTY('id')) }

        const group = await ForumGroup.findOne({where: {id}});

        if (!group) {
            return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('ForumGroup'))
        } else {
            await group.destroy()
        }

        return res.json({
            success: true
        })
    }

    async getAll(req, res, next) {
        let groups = await ForumGroup.findAll();

        return res.json(groups)
    }

}

module.exports = new GroupController()