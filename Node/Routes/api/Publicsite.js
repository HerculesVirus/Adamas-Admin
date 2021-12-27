//Routes/api/Publicsite
const express = require('express')
const router = express.Router()
const multer = require("multer");
const jwt = require('jsonwebtoken')
//Load Model 
const CategoryModel = require('../../models/Category')
const Product = require('../../models/Product')
const User = require('../../models/user')
const Cart = require('../../models/Cart')
const CartItem = require('../../models/CartItem')
//middleware
 const {requireAuth} =require('../../middlewares/authUser')
//  console.log(Object.values(requireAuth))
//Multer Config
//Store Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/img/Product')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
//receive Single file
const upload = multer({ storage: storage });
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

const maxAge = 3 * 24* 60 * 60
const createToken = (id) => {
    return jwt.sign({id} , `Ticket secret key` , {
        expiresIn : maxAge 
    })
}
//Custom Routes

//General
router.get('/publicsite/categries', (req,res) => {
    CategoryModel.find({})
    .then( data => res.json(data))
    .catch(err => console.log(err))
})
//It is used in Home Page
router.get('/publicsite/product', async (req,res) => {
        Product.find({})
        .then( data => res.json(data))
        .catch(err => console.log(err))
})

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
/////////////////////////////CartItem/////////////////////////////////
//EDIT data Populate #findOne
router.get('/publicsite/cartItem' , async(req,res)=>{
    const {id} =req.query
    await CartItem.findOne({cartId : id})
    .then(data => {
        console.log(data)
        res.json({data , message:"success"})
    })
    .catch(err => console.log(err))

})

//Qty Updated
router.put('/publicsite/cartItem' , async(req,res) => {
    console.log('Qty is updated')
    //Cart_Id
    const {id}=req.query
    CartItem.findOneAndUpdate ({"cartId" : id},{
        Qty : req.body.Qty
    })
    .then(data => res.json({message : "Qty is updated"}))
    .catch(err => console.log(err))
})
//delete cardItem
router.delete('/publicsite/cartItem' , async(re,res)=>{
    console.log(`Delete items`)
    const {id} = req.query;
    CartItem.findOneAndRemove({'_id' : id} , (err , data)=>{
        if(!err){
            console.log(data)
            res.json({message  : data})
        }
        else{
            console.log(err)
            res.json({message : err})
        }
    })
})
////////////////////////////////Cart//////////////
router.post('/publicsite/Cart', async(req,res)=> {

    console.log(`POST Cart api HIT`)
    // console.log(req.query.id)

    console.log(req.body);

    const productValue = req.body
    const userId = req.query.id;

    Cart.findOne({USER_ID : userId})
    .then(async (currentcart)=>{
        if(currentcart){
            //cart already exist
            console.log(`cart already exist`)
            //When cardId then productId already exist
            // console.log(currentcart._id)

            CartItem.findOne({cartId : currentcart._id})
            .then((currentProduct)=> {
                if(currentProduct){
                    console.log(currentProduct)
                    CartItem.findOne({productId : currentProduct.productId })
                    .then((item)=>{
                        if(item){
                            console.log('Item is already exist')
                            res.json({message : `this Item already exist`})
                        }
                        else{
                            //This is new Item
                            new CartItem({
                                cartId : item._id ,
                                productId  : productValue.productId,
                                Qty : productValue.Qty
                            })
                            .save()
                            .then(data => res.json({message: `cartItem is created successfully${data}`}))
                            .catch(err => console.log(err))
                        }
                    })
                }
                else{
                    console.log(`cartId not exist`)
                }
                //res.json({message : `This product already exist ${currentProduct}`})
            })
            .catch(err => console.log(err))   
        }
        else{
            //create a cart
            console.log(`create a cart`)
            const cart =  new Cart({ USER_ID : userId })
            console.log(cart._id)
            cart.save(function (err , result){
                console.log(result._id)
                const cartitem = new CartItem({
                    cartId : result._id ,
                    productId  : productValue.productId,
                    Qty : productValue.Qty
                })
                cartitem.save(function(err,result){
                    console.log('cartitem created')
                    res.json({message: `cartItem is created successfully${result}`})
                })
            })
        }
        
    })
    .catch(err => console.log(err))
})

module.exports = router ;