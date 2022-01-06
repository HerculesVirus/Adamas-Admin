const express = require('express')
const controller = require('../../../site-controller/site-auth.controller')
const router = express.Router()
const passport = require('passport')


//Register
router.route('/register').post(controller.register)
//sigin
router.route('/signin').post(controller.signin)
//SignIn with google
router.route('/google').get(passport.authenticate('google',{scope : ['profile' ,'email']}))
//After SignIn back to Home Screen
router.route('/google/redirect').get(passport.authenticate('google') , controller.authenticate)
module.exports = router


