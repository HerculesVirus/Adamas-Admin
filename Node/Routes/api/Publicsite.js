//Routes/api/Publicsite
const express = require('express')
const router = express.Router()
const multer = require("multer");
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

router.get('/google' , passport.authenticate('google',{
    scope : ['profile' ,'email']
}))

router.get('/google/redirect', passport.authenticate('google') ,(req,res)=> {
    //res.send(req.user)
    console.log(`redirect issue`)
    res.redirect('http://localhost:3000/')
})
/////////////////////////////CartItem/////////////////////////////////
////////////////////////////////Cart//////////////
router.post('/publicsite/Cart', async(req,res)=> {

    console.log(`POST Cart api HIT`)
    // console.log(req.query.id)
    // console.log(req.body);

    const productValue = req.body
    // console.log(productValue)
    const userId = req.query.id;
    const product = await Product.findOne({_id : productValue.productId});
    Cart.findOne({USER_ID : userId})
    .then((currentcart)=>{
        if(currentcart){
            //cart already exist
            // console.log(`cart already exist`)
            //When cardId then productId already exist
            // console.log(currentcart._id)
            CartItem.findOne({cartId : currentcart._id})
            .then(async(currentProduct)=> {
                if(currentProduct){
                    // console.log('current Product is here')
                    // console.log(currentProduct)
                    // console.log(productValue.productId)

                    CartItem.findOne({'productInfo' : productValue.productId })
                    .then((item)=>{
                        if(item){
                            // console.log(`itme is here`)
                            // console.log(`item.Qty : ${item.Qty}`)
                            // console.log(`productValue.Qty : ${productValue.Qty}`)

                            if(parseInt(item.Qty) !== parseInt(productValue.Qty))
                            {
                                CartItem.updateOne({ 'productInfo' : productValue.productId }  , { Qty: productValue.Qty } )
                                .then((done)=>{
                                    return res.json({message : "item Qty is updated"})
                                })
                                .catch(err => console.log(err))

                            }
                            else{
                                //console.log('Item is already exist')
                                return res.json({message : "Item Qty is Same"})
                            }
                        }
                        else{
                            //This is new Item
                            //console.log('new Product which is not exist it yet')
                            new CartItem({
                                cartId : currentcart._id ,
                                productInfo : product,
                                Qty : productValue.Qty
                            })
                            .save()
                            .then(data => res.json({message: `cartItem is created successfully`}))
                            .catch(err => console.log(err))
                        }
                    })
                    .catch(err => console.log(err))
                }
                else{
                    // console.log(`cartId not exist in cartItemSchema`)
                    // console.log(`create a cart`)
                        // console.log(result._id)
                        
                        const cartitem = new CartItem({
                            cartId : currentcart._id ,
                            productInfo  : product,
                            Qty : productValue.Qty
                        })
                        cartitem.save(function(err,result){
                            // console.log('cartitem created')
                            if(result){
                                res.json({message : `cartId not exist in cartItemSchema but create Sucessfully `})
                            }
                            else{
                                console.log(err)
                            }   
                        }) 
                }
            })
            .catch(err => console.log(err))   
        }
        else{
            //create a cart
            // console.log(`create a cart`)
            const cart =  new Cart({ USER_ID : userId })
            // console.log(cart._id)
            cart.save(function (err , result){
                // console.log(result._id)
                const cartitem = new CartItem({
                    cartId : result._id ,
                    productInfo  : product,
                    Qty : productValue.Qty
                })
                cartitem.save(function(err,result){
                    // console.log('cartitem created')
                    res.json({message: `First Card Created Sucessfully`})
                })
            })
        }
        
    })
    .catch(err => console.log(err))
})
//ALL products that a single userID holdes
//1-get a USER_ID from Cart
//2-Then get that's USER Cart_id from Carts Table
//3-Get all Products from Cartitem
router.get('/publicsite/Cart' , async(req,res) => {
    console.log(`GET Cart api HIT`)
    
    const userId = req.query.id;
    console.log(userId)
    Cart.findOne({USER_ID : userId})
    .then((currentUser)=> {
        if(currentUser){
            //get this user Cart_id
            //and check this card have some product or not
            CartItem.find({'cartId' : currentUser._id}).populate('productInfo')
            .then(async(cartItem)=>{
                if(cartItem){
                    console.log(cartItem) 
                    res.send(cartItem)  
                }
                else{
                    console.log(`No Product is yet added `)
                    res.json({message : `No Product is yet added`})
                }
            })
            .catch((err) => console.log(err))
        }
    })
    .catch(err => console.log(err))
})

//Update Qty only
router.put('/publicsite/Cart' , async(req,res) => {
    console.log(`Hello PUT HIT`)
    //Qty should be send in req.body
    const update = { Qty: 2 };
    const productValue = req.body
    const filter = {'productInfo' : productValue.productId};
    const userId = req.query.id;
    Cart.findOne({USER_ID : userId})
    .then((currentUser)=>{
        if(currentUser){
            CartItem.findOne(filter , update)
            .then(function(err,result){
                if(!err){
                    console.log(`result`)
                    res.json({message : `Qty is Updated successfully`})
                }
                else{
                    console.log(err)
                }
            })
            .catch(err => console.log(err))
        }
        else{
            console.log(`User ID not exist`)
        }
    })
    .catch(err => console.log(err))
})
//Delete
router.delete('/publicsite/CartDel', (req,res)=>{
    console.log(`Del API HIT`)

    console.log(req.data)
    // const Qty = req.body.Qty
    const id = req.body.productInfo._id
    console.log(`id : ${id}`)
    CartItem.findOneAndDelete({'productInfo' : id})
    .then(function(result,err){
        if(result){
            console.log(`result payload : ${result}`)
            CartItem.find({})
            .then(data => res.send(data))
            .catch(err => console.log(err))
        }
        else{
            console.log(`err : ${err}`)
        }
    })
    .catch(err=> console.log(err))
})
module.exports = router ;