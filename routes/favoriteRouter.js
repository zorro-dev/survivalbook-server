const Router = require('express')
const router = new Router()
const favoriteController = require('../controllers/favoriteController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {UserRole} = require('../models/constants')

router.post("/create", favoriteController.create)
router.post("/remove", favoriteController.remove)
router.post("/update", favoriteController.update)
router.post("/state", favoriteController.changeArticleFavoriteState)
router.post("/addToPart", favoriteController.addArticleToPart)
router.post("/removeFromPart", favoriteController.removeArticleFromPart)
router.get("/user/:user_id", favoriteController.getForUser)

module.exports = router