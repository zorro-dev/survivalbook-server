const Router = require('express')
const router = new Router()
const articleController = require('../controllers/articleController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {UserRole} = require('../models/constants')

router.post("/create", checkRole(UserRole.Admin), articleController.createArticle)
router.post("/remove", checkRole(UserRole.Admin), articleController.removeArticle)
router.post("/update", checkRole(UserRole.Admin), articleController.updateArticle)
router.post("/:id", articleController.get)

// router.get("/", encyclopediaController.getEncyclopedia)
// router.get("/library", encyclopediaController.getLibrary)


module.exports = router