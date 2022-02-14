const Router = require('express')
const router = new Router()
const favoriteController = require('../controllers/favoriteController')
const authMiddleware = require('../middleware/authMiddleware')

router.post("/create", authMiddleware, favoriteController.create)
router.post("/remove", authMiddleware, favoriteController.remove)
router.post("/update", authMiddleware, favoriteController.update)
router.post("/state", authMiddleware, favoriteController.changeArticleFavoriteState)
router.post("/addToPart", authMiddleware, favoriteController.addArticleToPart)
router.post("/removeFromPart", authMiddleware, favoriteController.removeArticleFromPart)
router.get("/byUser", authMiddleware, favoriteController.getForUser)

module.exports = router