const express = require('express')
const controller = require('../controllers/gitHub.js')
const router = express.Router()

router.post('/', controller.processCommits);

module.exports = router