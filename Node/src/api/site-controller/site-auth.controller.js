// const localStrategy = require('passport-local').Strategy; //Use later
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken')
const passport = require('passport')
//LoadModel
const User = require('../models/user')


//AgeOfToken
const maxAge = 3 * 24* 60 * 60
//CreateToken for jwt
const createToken = (id) => {
    return jwt.sign({id} , `Ticket secret key` , {
        expiresIn : maxAge 
    })
}

//Error Handle
const HandleErrors = (err) => {
    console.log(err.message , err.code)
    const errors = { name : '' , email: '' , password : ''}
    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'Email is not registerd'
    }
    //incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is not correct'
    }
    //duplicate  error code 11000
    if(err.code === 11000){
        errors.email = 'that email already exist';
        return errors;
    }
    //Validation error handler
    if(err.message.includes('user validation failed')){
        //console.log(err.errors)
        Object.values(err.errors).forEach( ({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

//Methods -> Procedure 
//Register === SignUp
exports.register = async(req,res) =>{
    console.log("API Hit /publicsite/register")
    // console.log(req.body)
    const {name ,email , password} =req.body
    try{
        // console.log(name ,email , password)
        const user = await User.create({ name ,email ,password })
        const token = createToken(user._id)
        res.status(201).json({user : user._id , message : "User is Created" , token});
    }
    catch(err){
        const errors = HandleErrors(err)
        // console.log(errors)
        res.send(errors)
        // console.log(`user is not created ${err}`)
    }
}
//Login === signin
exports.signin = async(req,res) =>{
    console.log("API Hit /publicsite/signin")
    // console.log(req.body)
    const {email , password} =req.body
    try{
        // console.log(email , password)
        const user = await User.login(email, password)
        const token = createToken(user._id)
        // call for passport authentication
        passport.authenticate('local', async (err, user, info) => {
            if (err) return res.status(400).send({ err, status: false, message: 'Oops! Something went wrong while authenticating' });
            // registered user
            else if (user) {
            // if (user.roleId === null && user.type !== 1)
            // return res.status(403).send({ status: false, message: 'Your account is inactive, kindly contact admin', user });
            // else if (user.type === 1)
            // return res.status(403).send({ success: false, message: 'Invalid login attempt' });
            // else if (user.accountStatus === 2)
            // return res.status(403).send({ success: false, message: 'Your account is inactive, kindly contact admin', user });
            // else {
            //     var accessToken = await user.token();
            //     let data = {
            //     ...user._doc,
            //     accessToken
            //     }
            //     await User.updateOne({ _id: user._id }, { $set: { accessToken } }, { upsert: true });
            //     return res.status(200).send({ status: true, message: 'User logged in successfully', data });
            // }
                return res.status(200).json({user , token})
            }
            // unknown user or wrong password
            else return res.status(402).send({ status: false, message: 'Incorrect email or password' });
        })(req,res);
    }
    catch(err){
        const errors = HandleErrors(err)
        // console.log(errors)
        res.send(errors)
        // console.log(`user is not created ${err}`)
    }
}
//After SignIn back to Home Screen
exports.authenticate = (req,res)=> {
    //res.send(req.user)
    console.log(`redirect issue`)
    res.redirect('http://localhost:3000/')
}