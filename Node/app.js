var express = require('express');
const bodyparser=require('body-parser')
var cors = require('cors'); 
var app = express();
const cookieParser = require('cookie-parser')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
const cookieSession =require('cookie-session')
const config = require('config')
const cookieKey = config.get('cookieKey')
// const GoogleStrategy= require('passport-google-oauth20').Strategy
// const config = require('config')
// const clientID = config.get('clientID')
// const clientSecret = config.get('clientSecret')

// console.log(cookieKey)

//middleware
app.use(cookieSession({
    maxAge : 24 * 60 * 60  * 1000 ,
    keys : [cookieKey]
}))
//DB Connection 
const connectDB = require('./config/db'); 
//Connect Database
connectDB();
//routes
const categories = require('./Routes/api/categories')
const products = require('./Routes/api/products')
const Publicsite = require('./Routes/api/Publicsite')



// passport.use(
//     new GoogleStrategy({
//         callbackURL : "http://localhost:8000/api/google/redirect" ,
//         clientID : clientID ,
//         clientSecret : clientSecret
//     },()=>{
//         console.log('passport callback function fired')
//     })
// )

//cors
//app.use(cors())
app.use(cors({
	origin: ['http://localhost:3000' , 'http://localhost:3001' , 'https://accounts.google.com/'],
	credentials:true,
	exposedHeaders: ["set-cookie"]
}));
app.options('*', cors());
//Middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))





// static Path for File Dump
app.use('/public', express.static('public'));
// use Routes
app.use('/api', categories)
app.use('/api', products)
app.use('/api', Publicsite)


app.listen(8000, function() {
  console.log('App running on port 8000');
});
