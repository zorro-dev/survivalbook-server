const Router = require('express')
const router = new Router()
const encyclopediaRouter = require('./encyclopediaRouter')
const userRouter = require('./userRouter')
const articleRouter = require('./articleRouter')
const favoriteRouter = require('./favoriteRouter')
const forumRouter = require('./forumRouter')

router.use('/user', userRouter)
router.use('/encyclopedia', encyclopediaRouter)
router.use('/article', articleRouter)
router.use('/favorite', favoriteRouter)
router.use('/forum', forumRouter)

module.exports = router