const {Part, ContentPart} = require('../models/models')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')
const {FavoriteArticle} = require("../models/models");
const {Article} = require("../models/models");

class ArticleController {

    async createArticle(req, res, next) {
        const {name, content, version, parent_id} = req.body

        console.log(name)
        console.log(content)
        console.log(version)
        console.log(parent_id)

        const parentPart = await Part.findOne({where: {id: parent_id}})
        if (!parentPart) {
            // TODO не найден родительский раздел
            console.log("TODO не найден родительский раздел")
        } else if (!parentPart.is_article) {
            // TODO родительский раздел не является статьей
            console.log("TODO родительский раздел не является статьей")
        } else {
            const article = await Article.create({name, content, version})
            await Part.update(
                {article_id: article.id},
                {where: {id: parent_id}}
            ).catch(err => {
                //res.send()
                console.log(err)
            })
            return res.json(article)
        }
    }

    async updateArticle(req, res, next) {
        const {id, name, content, version, parent_id} = req.body

        console.log("==================== Update Article ====================")
        console.log(id)
        console.log(name)
        console.log(content)
        console.log(version)
        console.log(parent_id)

        const parentPart = await Part.findOne({where: {id: parent_id}})
        if (!parentPart) {
            // TODO не найден родительский раздел
            console.log("TODO не найден родительский раздел")
        } else if (!parentPart.is_article) {
            // TODO родительский раздел не является статьей
            console.log("TODO родительский раздел не является статьей")
        } else {
            const article = await Article.update({name, content, version}, {where: {id}})
            return res.json(article);
        }

        return res.json({message: "error"});
    }

    async removeArticle(req, res) {
        const {id} = req.body


        return res.json({message: 'ok'})
    }

    async get(req, res) {
        const {id} = req.params
        const {part_id, user_id} = req.body

        let article = await Article.findOne({where: {id: id}})

        let favoriteArticle
        if (part_id && user_id) {
            favoriteArticle = await FavoriteArticle.findOne({where: {part_id, user_id, article_id: id}})
        }

        if (article) {
            return res.json({
                success: true,
                is_favorite: !!favoriteArticle,
                data: article.toJSON()
            })
        } else {
            // TODO статья не найдена
        }
    }

}

function validatePart(part) {
    if (!part || part.id || part.id.length === 0) return "id"
    if (!part || part.name || part.name.length === 0) return "name"
    if (!part || part.icon_url || part.icon_url.length === 0) return "icon_url"
    if (!part || part.version || part.version === undefined) return "version"
    if (!part || part.is_hidden || part.is_hidden.length === 0) return "is_hidden"
    if (!part || part.is_article || part.is_article === undefined) return "is_article"
    if (!part || part.fragment_type || part.fragment_type.length === 0) return "fragment_type"
    if (!part || part.article_id || part.article_id.length === 0) return "article_id"

    return undefined
}


module.exports = new ArticleController()