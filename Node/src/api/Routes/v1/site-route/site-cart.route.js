const express = require('express')
//controller
const controller = require('../../../site-controller/site-cart.controller')
const ensureUser = require('../../../middlewares/authUser')
const router = express.Router()

////////////////////////////////Cart//////////////
router.route('/Cart').post(ensureUser.checkAuthentication , controller.create)
router.route('/Cart').get(controller.retrieve)
router.route('/CartUpdate').put(controller.update)
router.route('/CartDel').delete(controller.delete)

module.exports = router