const Router = require('express')
const router = new Router()
const encyclopediaController = require('../controllers/encyclopediaController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {UserRole} = require('../models/constants')

router.post("/", checkRole(UserRole.Admin), encyclopediaController.create)
router.post("/search", encyclopediaController.search)
router.post("/createPart", checkRole(UserRole.Admin), encyclopediaController.createPart)
router.post("/updatePart", checkRole(UserRole.Admin), encyclopediaController.updatePart)
router.post("/removePart", checkRole(UserRole.Admin), encyclopediaController.removePart)
router.get("/", encyclopediaController.getEncyclopedia)
router.get("/library", encyclopediaController.getLibrary)
router.get("/:id", encyclopediaController.getOne)

module.exports = router