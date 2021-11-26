const {Part, ContentPart} = require('../models/models')
const ApiError = require('../error/ApiError')
const stemmer = require('../utils/stemming')

class EncyclopediaController {

    async createPart(req, res, next) {
        const {name, parent_id, is_article, is_hidden, icon_url, fragment_type, version} = req.body
        const {article_id} = req.body // ссылка на статью в Telegra.ph

        let parentPart;

        if (parent_id) {
            parentPart = await Part.findOne({where: {id : parent_id}})
        }
        const isFirstPart = (await Part.findAll()).length === 0;

        if (parentPart || isFirstPart) {
            const part = await Part.create({name, parent_id, is_article, is_hidden, article_id, icon_url, version, fragment_type})

            if (!isFirstPart) {
                await ContentPart.create({
                    parent : parent_id,
                    child : part.id
                })
            }

            return res.json(part)
        } else {
            return next(ApiError.PARENT_PART_NOT_FOUND())
        }
    }

    async create(req, res) {
        const {name} = req.body

        const muscle = await Muscle.create({name})
        return res.json(muscle)
    }

    async search(req, res) {
        const {request} = req.body

        const word = stemmer(request)
        return res.json({word : word})
    }

    async getEncyclopedia(req, res, next) {
        const encyclopedia = await getPartById(1)
        if (encyclopedia) {
            return res.json({
                success : 1,
                data : encyclopedia
            })
        } else {
            return next(ApiError.ENCYCLOPEDIA_NOT_FOUND())
        }
    }

    async getLibrary(req, res, next) {
        const mainParts = await getMainParts()
        if (mainParts) {
            return res.json({
                success : 1,
                data : mainParts
            })
        } else {
            return next(ApiError.ENCYCLOPEDIA_NOT_FOUND())
        }
    }

    async updatePart(req, res, next) {
        const {part} = req.body
        const validationError = validatePart(part);
        if (!part && !validationError) return next(ApiError.INVALID_UPDATE_PART(validationError))

        console.log(part.id)
        console.log(part.name)
        console.log(part.icon_url)
        console.log(part.version)
        console.log(part.is_hidden)
        console.log(part.is_article)
        console.log(part.article_id)
        console.log(part.fragment_type)

        await Part.update(
            {name : part.name,
                icon_url: part.icon_url, version: part.version,
                is_hidden: part.is_hidden, is_article: part.is_article,
                fragment_type: part.fragment_type, article_id: part.article_id},
            { where: { id: part.id } }
        ).catch(err => {
            //res.send()
            console.log(err)
        })

        return res.json({message : "ok"});
    }

    async removePart(req, res) {
        const {id} = req.body

        await removePartRecursive(id)

        return res.json({message : 'ok'})
    }

    async getAll(req, res) {
        //const muscles = await Muscle.findAll()
        return res.json({message : 'Все ок'})
    }

    async getOne(req, res) {
        return res.json({message : "ok"});
    }

}

function validatePart(part) {
    if (!part || part.id || part.id.length === 0) return "id"
    if (!part || part.name || part.name.length === 0) return "name"
    if (!part || part.icon_url || part.icon_url.length === 0) return "icon_url"
    if (!part || part.version || part.version=== undefined) return "version"
    if (!part || part.is_hidden || part.is_hidden.length === 0) return "is_hidden"
    if (!part || part.is_article || part.is_article=== undefined) return "is_article"
    if (!part || part.fragment_type || part.fragment_type.length === 0) return "fragment_type"
    if (!part || part.article_id || part.article_id.length === 0) return "article_id"

    return undefined
}

async function removePartRecursive(id) {
    let mainPart = await Part.findOne({where : {id}})

    const parts = await ContentPart.findAll({where : {parent : mainPart.id}})
    const contentPart = await ContentPart.findOne({where : {child : id}})

    for (let i = 0; i < parts.length; i ++) {
        let part = await Part.findOne({where:{id : parts[i].child}});
        const partId = part.id

        if (!part.is_article) {
            await removePartRecursive(partId)
        }

        await part.destroy()
        await parts[i].destroy()
    }

    await mainPart.destroy()
    await contentPart.destroy()

    return mainPart
}

async function getPartById(id) {
    let mainPart = await Part.findOne({where : {id}})

    const parts = await ContentPart.findAll({where : {parent : mainPart.id}})
    const contentPart = await ContentPart.findOne({where : {child : id}})

    const partList = []

    for (let i = 0; i < parts.length; i ++) {
        console.log("part child : " + parts[i].child)
        let part = await Part.findOne({where:{id : parts[i].child}});

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
    let mainPart = await Part.findOne({where : {id : 1}})

    const parts = await ContentPart.findAll({where : {parent : mainPart.id}})

    const partList = []

    for (let i = 0; i < parts.length; i ++) {
        let part = await Part.findOne({where:{id : parts[i].child}});

        if (!part) continue

        part = part.toJSON()
        delete part.updatedAt
        delete part.createdAt

        partList.push(part)
    }

    return partList
}

module.exports = new EncyclopediaController()