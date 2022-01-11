const express = require('express')
const controller = require('../../../site-controller/site-auth.controller')
const router = express.Router()
const passport = require('passport')


//Register
router.route('/register').post(controller.register)
//sigin
router.route('/signin').post(controller.signin)
router.route('/signin').get(controller.detailSignin)
//router.get('/user',(req,res)=>{res.send({user: req.user})})
//logout
router.route('/logout').get(controller.logout)
//SignIn with google
router.route('/google').get(passport.authenticate('google',{scope : ['profile' ,'email']}))
//After SignIn back to Home Screen
router.route('/google/redirect').get(passport.authenticate('google') , controller.authenticate)
module.exports = router


