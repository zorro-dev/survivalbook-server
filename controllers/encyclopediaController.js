const {EncyclopediaPart, Article} = require('../models/models')
const {EncyclopediaPart_RelationshipType} = require('../models/constants')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')

class EncyclopediaController {

  async createPart(req, res, next) {
    const {name, version, visibility, attributes, parent, child} = req.body

    const encyclopediaPart = await EncyclopediaPart.create({name, version, visibility, attributes, parent, child})

    return res.json(encyclopediaPart)
  }

  async updatePart(req, res, next) {
    let {id, name, version, visibility, attributes, parent, child} = req.body.part

    console.log(req.body)

    // TODO добавить проверку присылаемых данных
    if (!id) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('id'))

    version += 1

    const updateResponse = await EncyclopediaPart.update(
      {name, version, visibility, attributes, parent, child},
      {
        where: {id: id},
        returning: true
      }
    ).catch(err => {
      console.log(err)
    })

    const encyclopediaPart = updateResponse[1][0]

    return res.json(encyclopediaPart)
  }

  async removePart(req, res) {
    const {id} = req.body

    const encyclopediaPart = await EncyclopediaPart.findOne({where: {id}})
    if (encyclopediaPart) await encyclopediaPart.destroy()

    return res.json()
  }

  async getStatistics(req, res) {
    const parts = await EncyclopediaPart.findAll()
    const articles = await Article.findAll()

    const partsWithArticle = []
    const partsWithArticleLink = []
    parts.map(p => {
      if (p.child.type === EncyclopediaPart_RelationshipType.Article) {
        partsWithArticle.push(p)
        if (p.child.id !== "") {
          partsWithArticleLink.push(p)
        }
      }
    })

    const filledPartsPercent = ((articles.length / partsWithArticle.length) * 100).toFixed(2);
    const linkedPartsPercent = ((partsWithArticleLink.length / partsWithArticle.length) * 100).toFixed(2);

    return res.json({
      parts : {
        total: parts.length,
        with_articles: partsWithArticle.length,
        filled_percent: filledPartsPercent,
        linked_percent: linkedPartsPercent,
      },
      articles : {
        total: articles.length
      }
    })
  }

  async getParts(req, res, next) {
    const response = await EncyclopediaPart.findAll()
    return res.json(response)
  }

  async getPartsMobile(req, res, next) {
    const response = await EncyclopediaPart.findAll()
    return res.json({
      parts : response
    })
  }

  async search(req, res) {
    const {request} = req.body

    const word = stemmer(request)
    return res.json({word: word})
  }

  async getLibrary(req, res, next) {
    const mainParts = await getMainParts()
    if (mainParts) {
      return res.json({
        success: 1,
        data: mainParts
      })
    } else {
      return next(ApiError.ENCYCLOPEDIA_NOT_FOUND())
    }
  }

  async getAll(req, res) {
    return res.json({message: 'Все ок'})
  }

  async getOne(req, res) {
    return res.json({message: "ok"});
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

module.exports = new EncyclopediaController()