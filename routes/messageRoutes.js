const express = require('express')
const { protect } = require('../middlewares/auth.js')
const { sendMessage, allMessages } = require('../controllers/messageControllers.js')
const init_route = require('../middlewares/initRoute.js')

const router = express.Router()

router.route('/').post(init_route, protect, sendMessage)
router.route('/:chatId').get(protect, allMessages)

module.exports = router
