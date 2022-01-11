// const localStrategy = require('passport-local').Strategy; //Use later
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken')
const passport = require('passport')
//LoadModel
const User = require('../models/user')


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
        res.status(201).json({message : "User is Created"});
    }
    catch(err){
        const errors = HandleErrors(err)
        // console.log(errors)
        res.send(errors)
        // console.log(`user is not created ${err}`)
    }
}
//Login === signin
exports.signin = async(req, res, next) => {
    console.log('login hit')
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      console.log(`user : ${user}`)
      console.log(`err : ${err}`)
      console.log(`info : ${info}`)
      if (!user){ return res.json("No User Exists");}
      else {
        req.login(user, (err) => {
          if (err) throw err;
          console.log(`req.user : ${req.user}`);
          return res.json({user:req.user}); 
        });
      }
    })(req, res, next);
}
exports.detailSignin =(req,res)=>{
    
}
exports.logout = async(req,res)=>{
    console.log('logout api hit')
    req.logout();
    res.json({message: "logout successful"})
}
//After SignIn back to Home Screen
exports.authenticate = (req,res)=> {
    //res.send(req.user)
    console.log(`redirect issue`)
    res.redirect('http://localhost:3000/')
}