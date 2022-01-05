//Routes/api/PublicPage/categories
const express = require('express')
const controller = require('../../../site-controller/site-categories.controller')
const router = express.Router()
//middleware

//Routes
router.route('/categries').get(controller.retrieve)

module.exports = router



