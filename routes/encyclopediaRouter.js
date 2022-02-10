const Router = require('express')
const router = new Router()
const encyclopediaController = require('../controllers/encyclopediaController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {UserRole} = require('../models/constants')

router.post("/search", encyclopediaController.search)
router.post("/createPart", checkRole(UserRole.Admin), encyclopediaController.createPart)
router.post("/updatePart", checkRole(UserRole.Admin), encyclopediaController.updatePart)
router.post("/removePart", checkRole(UserRole.Admin), encyclopediaController.removePart)
router.get("/", encyclopediaController.getParts)
router.get("/statistics", encyclopediaController.getStatistics)

router.get("/library", encyclopediaController.getLibrary)
router.get("/:id", encyclopediaController.getOne)

module.exports = router