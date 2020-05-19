const express = require('express')
const controller = require('../controllers/vk')
const router = express.Router()

router.post('/vk', controller.answer);

module.exports = router