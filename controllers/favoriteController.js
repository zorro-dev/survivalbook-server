const {Part, ContentPart} = require('../models/models')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')
const {FavoriteArticle, Account, FavoritePart, Article} = require("../models/models");

class ArticleController {

    async create(req, res, next) {
        const {name, icon} = req.body
        const account_id = req.auth.id

        const account = await Account.findOne({where: {id: account_id}})
        if (!account) {
            return next(ApiError.internal('Не найден пользователь'))
        } else {
            const favoritePart = await FavoritePart.create({name, accountId: account_id, icon})
            return res.json(favoritePart)
        }
    }

    async changeArticleFavoriteState(req, res, next) {
        const {article_id, account_id} = req.body

        let favoriteArticle = await FavoriteArticle.findOne({where: {articleId: article_id, accountId: account_id}})
        if (!favoriteArticle) {
            await FavoriteArticle.create({articleId: article_id, accountId: account_id})

            return res.json({
                is_favorite: true,
            })
        } else {
            await favoriteArticle.destroy();
            return res.json({
                is_favorite: false
            })
        }
    }

    async update(req, res, next) {
        const {id, name, icon} = req.body
        const account_id = req.auth.id

        let favoritePart = await FavoritePart.findOne({where: {id: id, accountId: account_id}})
        if (!favoritePart) {
            return next(ApiError.internal('Не найден избранный раздел'))
        } else {
            await FavoritePart.update({name, icon}, {where: {id}})
            favoritePart = await FavoritePart.findOne({where: {id: id}})
            return res.json(favoritePart)
        }
    }

    async remove(req, res) {
        const {id} = req.body
        const account_id = req.auth.id

        let favoritePart = await FavoritePart.findOne({where: {id: id, accountId: account_id}})
        await favoritePart.destroy();

        return res.json({success: true})
    }

    async addArticleToPart(req, res, next) {
        const {favorite_part_id, favorite_article_id} = req.body
        const account_id = req.auth.id

        let favoritePart = await FavoritePart.findOne({where: {id: favorite_part_id, accountId: account_id}})
        let favoriteArticle = await FavoriteArticle.findOne({where: {id: favorite_article_id, accountId: account_id}})
        if (!favoritePart) {
            return next(ApiError.internal('Не найден избранный раздел'))
        } else if (!favoriteArticle) {
            return next(ApiError.internal('Не найдена избранная статья'))
        } else {
            await FavoriteArticle.update({favoritePartId: favorite_part_id}, {where: {id: favorite_article_id, accountId: account_id}})
            return res.json({
                success: true
            })
        }
    }

    async removeArticleFromPart(req, res, next) {
        const {favorite_part_id, favorite_article_id} = req.body
        const account_id = req.auth.id

        let favoritePart = await FavoritePart.findOne({where: {id: favorite_part_id, accountId: account_id}})
        let favoriteArticle = await FavoriteArticle.findOne({where: {id: favorite_article_id, accountId: account_id}})
        if (!favoritePart) {
            return next(ApiError.internal('Не найден избранный раздел'))
        } else if (!favoriteArticle) {
            return next(ApiError.internal('Не найдена избранная статья'))
        } else {
            await FavoriteArticle.update({favoritePartId: null}, {where: {id: favorite_article_id, accountId: account_id}})
            return res.json({
                success: true
            })
        }
    }

    async getForUser(req, res) {
        const account_id = req.auth.id

        let favoriteParts = await FavoritePart.findAll({where: {accountId: account_id}})
        let favoriteArticles = await FavoriteArticle.findAll({where: {accountId: account_id}})

        if (!favoriteParts) favoriteParts = []
        if (!favoriteArticles) favoriteArticles = []

        // const parts = []
        //
        // const map = new Map()
        //
        // for (let i = 0; i < favoriteArticles.length; i++) {
        //     const favoriteArticle = favoriteArticles[i]
        //     const part_id = favoriteArticle.part_id
        //     const favoritePartId = favoriteArticle.favorite_part_id
        //     const part = await Part.findOne({where: {id: part_id}})
        //
        //     console.log(favoritePartId)
        //
        //     if (!favoritePartId) {
        //         parts.push(part)
        //     } else {
        //
        //         let list = map.get(favoritePartId)
        //
        //         if (!list) list = []
        //
        //         list.push(part)
        //
        //         map.set(favoritePartId, list);
        //     }
        // }
        //
        // const favoritePartsJson = JSON.parse(JSON.stringify(favoriteParts))
        //
        // for (let i = 0; i < favoriteParts.length; i++) {
        //     const favoritePart = favoriteParts[i]
        //
        //     console.log(favoritePart.id);
        //     console.log(map.get(favoritePart.id.toString()));
        //
        //     favoritePartsJson[i].parts = map.get(favoritePart.id.toString())
        // }

        return res.json({
            parts: favoriteParts,
            articles: favoriteArticles
        })
    }

}


module.exports = new ArticleController()