const express = require('express');
const { login, register, getAllUsers } = require('../controllers/userControllers.js')
const init_route = require('../middlewares/initRoute.js')
const { protect } = require('../middlewares/auth.js')

const router = express.Router()

router.post('/login', init_route, login)
router.post('/register', init_route, register)
router.get('/all-users', init_route, protect, getAllUsers)

module.exports = router