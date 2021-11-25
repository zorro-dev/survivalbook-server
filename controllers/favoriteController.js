const {Part, ContentPart} = require('../models/models')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')
const {FavoriteArticle} = require("../models/models");
const {FavoritePart} = require("../models/models");
const {User} = require("../models/models");
const {Article} = require("../models/models");

class ArticleController {

    async create(req, res, next) {
        const {name, user_id, icon} = req.body

        console.log(name)
        console.log(user_id)
        console.log(icon)

        const user = await User.findOne({where: {id: user_id}})
        if (!user) {
            // TODO не найден пользователь
            console.log("TODO не найден пользователь")
        } else {
            const favoritePart = await FavoritePart.create({name, user_id, icon})
            return res.json({
                success: true,
                data: favoritePart
            })
        }
    }

    async changeArticleFavoriteState(req, res, next) {
        const {part_id, article_id, user_id} = req.body

        console.log(part_id)
        console.log(article_id)
        console.log(user_id)

        let favoriteArticle = await FavoriteArticle.findOne({where: {article_id, user_id, part_id}})
        if (!favoriteArticle) {
            await FavoriteArticle.create({article_id, user_id, part_id})

            const part = await Part.findOne({where: {id: part_id}})
            return res.json({
                success: true,
                is_favorite: true,
                part
            })
        } else {
            await favoriteArticle.destroy();
            return res.json({
                success: true,
                is_favorite: false
            })
        }
    }

    async update(req, res, next) {
        const {id, name, user_id, icon} = req.body

        console.log("==================== Update Favorite Part ====================")
        console.log(id)
        console.log(name)
        console.log(user_id)
        console.log(icon)

        let favoritePart = await FavoritePart.findOne({where: {id: id, user_id: user_id}})
        if (!favoritePart) {
            // TODO не найден избранный раздел
            console.log("TODO не найден избранный раздел")
        } else {
            await FavoritePart.update({id, name, user_id, icon}, {where: {id}})
            favoritePart = await FavoritePart.findOne({where: {id: id}})
            return res.json({
                success: true,
                data: favoritePart
            })
        }

        return res.json({message: "error"});
    }

    async remove(req, res) {
        const {id, user_id} = req.body

        let favoritePart = await FavoritePart.findOne({where: {id: id, user_id: user_id}})
        await favoritePart.destroy();

        return res.json({success: true})
    }

    async addArticleToPart(req, res, next) {
        const {favorite_part_id, article_id, user_id} = req.body

        console.log("==================== Add Article Part ====================")
        console.log(favorite_part_id)
        console.log(article_id)
        console.log(user_id)

        let favoritePart = await FavoritePart.findOne({where: {id: favorite_part_id, user_id}})
        let favoriteArticle = await FavoriteArticle.findOne({where: {article_id, user_id}})
        if (!favoritePart) {
            // TODO не найден избранный раздел
            console.log("TODO не найден избранный раздел")
        } else if (!favoriteArticle) {
            // TODO не найдена избранная статья
            console.log("TODO не найдена избранная статья")
        } else {
            await FavoriteArticle.update({favorite_part_id: favorite_part_id}, {where: {article_id, user_id}})
            return res.json({
                success: true,
            })
        }

        return res.json({message: "error"});
    }

    async removeArticleFromPart(req, res, next) {
        const {favorite_part_id, article_id, user_id} = req.body

        console.log("==================== Remove Article Part ====================")
        console.log(favorite_part_id)
        console.log(article_id)
        console.log(user_id)

        let favoritePart = await FavoritePart.findOne({where: {id: favorite_part_id, user_id}})
        let favoriteArticle = await FavoriteArticle.findOne({where: {article_id, user_id}})
        if (!favoritePart) {
            // TODO не найден избранный раздел
            console.log("TODO не найден избранный раздел")
        } else if (!favoriteArticle) {
            // TODO не найдена избранная статья
            console.log("TODO не найдена избранная статья")
        } else {
            await FavoriteArticle.update({favorite_part_id: null}, {where: {article_id, user_id}})
            return res.json({
                success: true,
            })
        }

        return res.json({message: "error"});
    }

    async get(req, res) {
        const {id} = req.params

        let article = await Article.findOne({where: {id: id}})

        if (article) {
            return res.json({
                success: true,
                data: article.toJSON()
            })
        } else {
            // TODO статья не найдена
        }
    }

    async getForUser(req, res) {
        const {user_id} = req.params

        let favoriteParts = await FavoritePart.findAll({where: {user_id: user_id}})
        let favoriteArticles = await FavoriteArticle.findAll({where: {user_id: user_id}})

        if (!favoriteParts) favoriteParts = []
        if (!favoriteArticles) favoriteArticles = []

        const parts = []

        const map = new Map()

        for (let i = 0; i < favoriteArticles.length; i++) {
            const favoriteArticle = favoriteArticles[i]
            const part_id = favoriteArticle.part_id
            const favoritePartId = favoriteArticle.favorite_part_id
            const part = await Part.findOne({where: {id: part_id}})

            console.log(favoritePartId)

            if (!favoritePartId) {
                parts.push(part)
            } else {

                let list = map.get(favoritePartId)

                if (!list) list = []

                list.push(part)

                map.set(favoritePartId, list);
            }
        }

        const favoritePartsJson = JSON.parse(JSON.stringify(favoriteParts))

        for (let i = 0; i < favoriteParts.length; i++) {
            const favoritePart = favoriteParts[i]

            console.log(favoritePart.id);
            console.log(map.get(favoritePart.id.toString()));

            favoritePartsJson[i].parts = map.get(favoritePart.id.toString())
        }

        return res.json({
            success: true,
            data: {
                favorite_parts: favoritePartsJson,
                ungrouped: parts,
            }
        })
    }

}


module.exports = new ArticleController()