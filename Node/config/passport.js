const passport = require('passport')
const GoogleStrategy= require('passport-google-oauth20').Strategy
const config = require('config')
const clientID = config.get('clientID')
const clientSecret = config.get('clientSecret')
// Load Model
const User = require('../models/user')

passport.serializeUser((user,done)=> {
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new GoogleStrategy({
        callbackURL : "/auth/google/redirect" ,
        clientID : clientID ,
        clientSecret : clientSecret
    },(accessToken , refreshToken , profile , email , done )=>{
        //passport callback function
        console.log('passport callback function fired')
        console.log(profile)
        User.findOne({googleId : profile.id})
        .then((currentUser) =>{
            if(currentUser){
                console.log(`current User : ${currentUser}`)
                done(null,currentUser)
            }
            else{
                new User({
                    username : profile.displayName ,
                    googleId : profile.id ,
                    email : email
                }).save().then((newUser) =>{
                    // res.send('HEllo')
                    console.log(`new user with following data :  ${newUser}`)
                    done(null,newUser)
                })
                .catch((err)=>console.log(err))
                
            }
        })
    })
)