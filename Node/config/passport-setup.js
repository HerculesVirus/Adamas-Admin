const passport = require('passport')
const GoogleStrategy= require('passport-google-oauth20').Strategy
const config = require('config')
const clientID = config.get('clientID')
const clientSecret = config.get('clientSecret')

// console.log(`This is from passport setup`)
// console.log(`clientID : ${clientID}`)
// console.log(`clientSecret : ${clientSecret}`)
// // Load Model
const User = require('../models/user')

passport.serializeUser((user,done)=> {
    console.log(`Serialized`)
    console.log(user.id)
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    console.log(`Deserialized`)
    console.log(id)
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use("google",
    new GoogleStrategy({
        callbackURL : "/api/google/redirect" ,
        clientID : clientID ,
        clientSecret : clientSecret
    },(accessToken , refreashToken , profile, done)=>{
        //passport callback function
        console.log('passport callback function fired')
        console.log(profile.emails[0].value)
        User.findOne({email : profile.emails[0].value})
        .then((currentUser) =>{
            if(currentUser){
                console.log(`current User : ${currentUser}`)
                done(null,currentUser)
            }
            else{
                new User({
                    name : profile.displayName ,
                    email : profile.emails[0].value ,
                    password : "#@!$$%$"
                }).save().then((newUser) =>{
                    // res.send('HEllo')
                    console.log(`new user with following data :  ${newUser}`)
                    done(null,newUser)
                })
                .catch((err)=>console.log(err))
                
            }
        })
        .catch((err) => console.log(err))
    })
)