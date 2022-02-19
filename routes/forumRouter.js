const Router = require('express')
const router = new Router()
const groupController = require('../controllers/forum/groupController')
const partController = require('../controllers/forum/partController')
const themeController = require('../controllers/forum/themeController')
const trackedController = require('../controllers/forum/trackedController')
const authMiddleware = require('../middleware/authMiddleware')

router.post("/group/create", groupController.create)
router.post("/group/update", groupController.update)
router.post("/group/remove", groupController.remove)
router.get("/group/getAll", groupController.getAll)

router.post("/part/create", partController.create)
router.post("/part/update", partController.update)
router.post("/part/remove", partController.remove)
router.get("/part/getAll", partController.getAll)

router.post("/theme/create", themeController.create)
router.post("/theme/update", themeController.update)
router.post("/theme/remove", themeController.remove)
router.post("/theme/setLastMessage", authMiddleware, themeController.setLastReadMessage)
router.get("/theme/getAll", themeController.getAll)

router.post("/sendMessage", authMiddleware, themeController.sendMessage)
router.post("/removeMessage", authMiddleware, themeController.removeMessage)
router.get("/getMessages", themeController.getMessages)
router.get("/getLastReadMessages", authMiddleware, themeController.getLastReadMessages)

router.post("/tracked/changeState", authMiddleware, trackedController.changeState)
router.get("/tracked/getAll", authMiddleware, trackedController.getAll)

module.exports = router