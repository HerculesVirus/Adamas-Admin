var express = require('express');
const bodyparser=require('body-parser')
var cors = require('cors'); 
var app = express();
const cookieParser = require('cookie-parser')


//DB Connection 
const connectDB = require('./config/db'); 
//Connect Database
connectDB();
//routes
const categories = require('./Routes/api/categories')
const products = require('./Routes/api/products')
const Publicsite = require('./Routes/api/Publicsite')


//cors
//app.use(cors())
app.use(cors({
	origin: ['http://localhost:3000' , 'http://localhost:3001' , 'https://console.cloud.google.com/'],
	credentials:true,
	exposedHeaders: ["set-cookie"]
}));
app.options('*', cors());
//Middleware
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
