const Router = require('express')
const router = new Router()
const groupController = require('../controllers/forum/groupController')
const partController = require('../controllers/forum/partController')
const themeController = require('../controllers/forum/themeController')
const trackedController = require('../controllers/forum/trackedController')
const checkRole = require('../middleware/checkRoleMiddleware')
const {UserRole} = require('../models/constants')

router.post("/group/create", checkRole(UserRole.Admin), groupController.create)
router.post("/group/update", checkRole(UserRole.Admin), groupController.update)
router.post("/group/remove", checkRole(UserRole.Admin), groupController.remove)
router.get("/group/getAll", groupController.getAll)

router.post("/part/create", checkRole(UserRole.Admin), partController.create)
router.post("/part/update", checkRole(UserRole.Admin), partController.update)
router.post("/part/remove", checkRole(UserRole.Admin), partController.remove)
router.get("/part/getOne/:id", partController.getOne)

router.post("/theme/create", checkRole(UserRole.Admin), themeController.create)
router.post("/theme/update", checkRole(UserRole.Admin), themeController.update)
router.post("/theme/remove", checkRole(UserRole.Admin), themeController.remove)
router.post("/theme/setLastMessage", checkRole(UserRole.User), themeController.setLastReadMessage)

router.post("/sendMessage", checkRole(UserRole.User), themeController.sendMessage)
router.post("/removeMessage", checkRole(UserRole.User), themeController.removeMessage)
router.get("/getMessages", checkRole(UserRole.Visitor), themeController.getMessages)

router.post("/tracked/changeState", checkRole(UserRole.User), trackedController.changeState)
router.get("/tracked/getAll", checkRole(UserRole.User), trackedController.getAll)

//router.get("/part/getOne/{id}", partController.getOne)

//router.post("/remove", checkRole(UserRole.Admin), articleController.removeArticle)
//router.post("/update", checkRole(UserRole.Admin), articleController.updateArticle)
//router.post("/:id", articleController.get)


module.exports = router