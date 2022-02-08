const {EncyclopediaPart, Part, ContentPart} = require('../models/models')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')

class EncyclopediaController {

  async createPart(req, res, next) {
    const {name, version, visibility, attributes, parent, child} = req.body

    const encyclopediaPart = await EncyclopediaPart.create({name, version, visibility, attributes, parent, child})

    return res.json(encyclopediaPart)
  }

  async updatePart(req, res, next) {
    const {id, name, version, visibility, attributes, parent, child} = req.body

    // TODO добавить проверку присылаемых данных
    if (!id) return next(ApiError.REQUIRED_OBJECT_NOT_FOUND('id'))

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

  async getParts(req, res, next) {
    const response = await EncyclopediaPart.findAll()
    return res.json(response)
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
    //const muscles = await Muscle.findAll()
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

async function getPartById(id) {
  let mainPart = await Part.findOne({where: {id}})

  const parts = await ContentPart.findAll({where: {parent: mainPart.id}})
  const contentPart = await ContentPart.findOne({where: {child: id}})

  const partList = []

  for (let i = 0; i < parts.length; i++) {
    console.log("part child : " + parts[i].child)
    let part = await Part.findOne({where: {id: parts[i].child}});

    if (!part) continue
    part = part.toJSON()

    delete part.updatedAt
    delete part.createdAt

    part.parent_id = id

    if (part.is_article) {
      partList.push(part)
    } else {
      partList.push(await getPartById(part.id))
    }
  }

  mainPart = mainPart.toJSON()

  mainPart.parent_id = contentPart ? contentPart.parent : 1

  mainPart.parts = partList

  delete mainPart.updatedAt
  delete mainPart.createdAt

  return mainPart
}

async function getMainParts() {
  let mainPart = await Part.findOne({where: {id: 1}})

  const parts = await ContentPart.findAll({where: {parent: mainPart.id}})

  const partList = []

  for (let i = 0; i < parts.length; i++) {
    let part = await Part.findOne({where: {id: parts[i].child}});

    if (!part) continue

    part = part.toJSON()
    delete part.updatedAt
    delete part.createdAt

    partList.push(part)
  }

  return partList
}

module.exports = new EncyclopediaController()