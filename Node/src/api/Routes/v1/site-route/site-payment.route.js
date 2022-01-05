const express = require('express')
const controller = require('../../../site-controller/site-payment.controller')
const router = express.Router()

//Routes
router.route('/stripe').post(controller.createIntent)
router.route('/confirm-payment').post(controller.confirmPayment)

module.exports = router