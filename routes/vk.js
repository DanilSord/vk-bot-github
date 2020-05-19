const express = require('express')
const controller = require('../controllers/vk')
const router = express.Router()

router.post('/', controller.answer);

module.exports = router