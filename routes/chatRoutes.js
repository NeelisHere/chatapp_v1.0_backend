const express = require('express');
const { 
    accessChat, 
    getChats, 
    createGroupChat, 
    renameGroup,
    removeFromGroup,
    addToGroup
} = require('../controllers/chatControllers.js')
const init_route = require('../middlewares/initRoute.js')
const { protect } = require('../middlewares/auth.js')
const router = express.Router()

router.post('/access-chat', init_route, protect, accessChat)
router.get('/get-chats', init_route, protect, getChats)
router.post('/group/create', init_route, protect, createGroupChat)
router.put('/group/rename', init_route, protect, renameGroup)
router.put('/group/add-user', init_route, protect, addToGroup)
router.put('/group/remove-user', init_route, protect, removeFromGroup)

module.exports = router