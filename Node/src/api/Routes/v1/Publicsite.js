//Routes/api/Publicsite
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
//Load Model 
const CategoryModel = require('../../models/Category')
const Product = require('../../models/Product')
const User = require('../../models/user')
const Cart = require('../../models/Cart')
const CartItem = require('../../models/CartItem')
//middleware
 const {requireAuth} =require('../../middlewares/authUser');
//  console.log(Object.values(requireAuth))


//Custom Routes

//General
router.get('/publicsite/categries', (req,res) => {
    CategoryModel.find({})
    .then( data => res.json(data))
    .catch(err => console.log(err))
})
//It is used in Home Page
router.get('/publicsite/product', async (req,res) => {
        await Product.find({})
        .then( data => res.json(data))
        .catch(err => console.log(err))
})
//For Featured Products
router.get('/publicsite/product/featured' , async (req,res) => {
    await Product.find({Featured : 'true'})
    .then((data)=>{
        if(data){
            //array of object is I think given to me
            //console.log(`Featured product : ${data}`)
            res.json(data)
        }
        else{
            console.log(`No Featured Product is exist`)
        }
    })
})
//New Arrival Products
router.get('/publicsite/product/latest' , async (req,res) => {
    await Product.find({Featured : 'false'})
    .then((data)=>{
        if(data){
            //array of object is I think given to me
            //console.log(`Featured product : ${data}`)
            res.json(data)
        }
        else{
            console.log(`No Featured Product is exist`)
        }
    })
})
//Product Preview
router.get('/publicsite/ProductPreview/:id' , async(req,res)=> {
    const { id } = req.params
    console.log(`/product findOne :  ${id}`)

    if(id){
        Product.findOne({ _id : id })
        .then( data => res.json(data))
        .catch(err => console.log(err)) 
    }
})

//CategoryShop publicsite/category/product
router.get('/publicsite/category/product'  , async (req,res) => {
    const PAGE_SIZE = 3
    const page = parseInt(req.query.page || "0");
  
    const {id} =req.query
    console.log("before id")
    console.log(id)
    console.log(typeof id)
    if(id && typeof id !== undefined && id !=="null" ){
        console.log('IF get by ids : '+id)
        const total = await Product.countDocuments({"Category.id" : id});
        Product.find({"Category.id" : id})
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page)
        .then(data =>{
            res.json({totalPages: Math.ceil(total /PAGE_SIZE), data})
        })
        .catch(err =>{
            console.log(err)
            return;
        } )
    }
    else{
        console.log('ELSE ALL documents : ')
        const total = await Product.countDocuments({});
        console.log(total)
        await Product.find({})
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page)
        .then( data => {
            res.json({totalPages: Math.ceil(total /PAGE_SIZE), data})
        })
        .catch(err =>{
            console.log(err)
            return;
        })
    }

})
//Register
router.post('/publicsite/register', async(req,res) =>{
    console.log("API Hit /publicsite/register")
    console.log(req.body)
    const {name ,email , password} =req.body
    try{
        console.log(name ,email , password)
        const user = await User.create({ name ,email ,password })
        const token = createToken(user._id)
        res.status(201).json({user : user._id , message : "User is Created" , token});
    }
    catch(err){
        const errors = HandleErrors(err)
        console.log(errors)
        res.send(errors)
        // console.log(`user is not created ${err}`)
    }
})
//sigin
router.post('/publicsite/signin', async(req,res) =>{
    console.log("API Hit /publicsite/signin")
    console.log(req.body)
    const {email , password} =req.body
    try{
        console.log(email , password)
        const user = await User.login(email, password)
        const token = createToken(user._id)
        
        //res.cookie('jwt', token , {httpOnly : true , maxAge : maxAge *1000})
        res.status(200).json({user , token})
    }
    catch(err){
        const errors = HandleErrors(err)
        console.log(errors)
        res.send(errors)
        // console.log(`user is not created ${err}`)
    }
})
//SignIn with google
router.get('/google' , passport.authenticate('google',{
    scope : ['profile' ,'email']
}))
//After SignIn back to Home Screen
router.get('/google/redirect', passport.authenticate('google') ,(req,res)=> {
    //res.send(req.user)
    console.log(`redirect issue`)
    res.redirect('http://localhost:3000/')
})

module.exports = router ;