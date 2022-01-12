//LoadModel
const mongoose = require('mongoose')
const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')
const Product = require('../models/Product')

//Methods
//Create new Cart for new User
//1- check if new user then create First Item in CartItem'sTable  and add in YourCart
//2- If current user then only create the CartItem that he want in YourCart
//3- If item exist then tell User it is already in cart
//4- If he want to update Qty than update in DB
exports.create = async(req,res)=> {
    console.log(`POST Cart api HIT`)
    // console.log(req.query.id)
    // console.log(req.body);
    const productValue = req.body
    const userId = req.query.id;
    const product = await Product.findOne({_id : productValue.productId});
    await Cart.findOne({USER_ID : userId})
    .then(async(currentcart)=>{
        if(currentcart){
            //cart already exist
            // console.log(`cart already exist`)
            //When cardId then productId already exist
            // console.log(currentcart._id)
            await CartItem.findOne({cartId : currentcart._id})
            .then(async(currentProduct)=> {
                if(currentProduct){
                    // console.log('current Product is here')
                    // console.log(currentProduct)
                    // console.log(productValue.productId)

                    await CartItem.findOne({'productInfo' : productValue.productId })
                    .then((item)=>{
                        if(item){
                            // console.log(`itme is here`)
                            // console.log(`item.Qty : ${item.Qty}`)
                            // console.log(`productValue.Qty : ${productValue.Qty}`)

                            if(parseInt(item.Qty) !== parseInt(productValue.Qty))
                            {
                                CartItem.updateOne({ 'productInfo' : productValue.productId }  , { Qty: productValue.Qty } )
                                .then((done)=>{
                                    // console.log(`done`)
                                    // console.log(done)
                                    CartItem.find({}).populate('productInfo')
                                    .then(data =>{
                                        return res.json({message : "item Qty is updated" ,data:data})
                                    })
                                    .catch(err => console.log(err))                                    
                                    
                                })
                                .catch(err => console.log(err))
                            }
                            else{
                                //console.log('Item is already exist')
                                CartItem.find({}).populate('productInfo')
                                .then(data =>{
                                    return res.json({message : "Item Qty is Same", data:data})
                                })
                                .catch(err => console.log(err))
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
                            .then(data =>{
                                console.log(`cartItem is created successfully`)
                                //console.log(data)
                                CartItem.find({}).populate('productInfo')
                                .then(data =>{
                                    // console.log(`all items`)
                                    // console.log(data)
                                    return res.json({message: `cartItem is created successfully` , data})
                                })
                                .catch(err=> console.log(err))
                                
                            })
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
                                // console.log(`cartId not exist in cartItemSchema but create Sucessfully`)
                                // console.log(result)
                                CartItem.find({}).populate('productInfo')
                                .then(data =>{
                                    // console.log(`all items`)
                                    // console.log(data)
                                    return res.json({message : `cartId not exist in cartItemSchema but create Sucessfully` , data})
                                })
                                .catch(err => console.log(err))
                                
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
            const cart =  new Cart({ USER_ID : userId , status : 1})
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
}
//ALL products that a single userID hold
//1-get a USER_ID from Cart
//2-Then get that's USER Cart_id from Cart's Table
//3-Get all Products from Cartitem
exports.retrieve = async(req,res) => {
    console.log(`GET Cart api HIT`)
    
    const userId = req.query.id;
    //console.log(userId)
    await Cart.findOne({USER_ID : userId})
    .then(async(currentUser)=> {
        if(currentUser){
            //get this user Cart_id
            //and check this card have some product or not
            await CartItem.find({'cartId' : currentUser._id}).populate('productInfo')
            .then(async(cartItem)=>{
                if(cartItem){
                    // console.log(cartItem) 
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
}
//Update Qty of cartItem only
//1-Check if productId exist in cartItem than update the Qty
exports.update = async(req,res) => {
    console.log(`Hello PUT HIT`)
    //Qty should be send in req.body
    const id = req.params.cartItemId;
    const pItem = req.body.data

    console.log(`pItem._id : ${pItem.user}`)
    //pItem.cartItem.productInfo._id -> productId

    
    //pItem.Qty is new Qty
    Cart.find({USER_ID :pItem.user })
    .then(async currentUser =>{
        if(currentUser){
            console.log(currentUser)
            const id = currentUser[0]._id
            
            console.log(`_id : ${id}`)
            const filter = {"cartId" : id} 
            const update = {"Qty" : pItem.Qty}
            
            await CartItem.updateOne(filter,update)
            .then(async updatedCart => {
                console.log(updatedCart)
                await CartItem.find({"cartId": id}).populate("productInfo")
                .then((data)=>{
                    console.log(`PUT API find all data`)
                    console.log(data)
                    return res.json({message : "updated Successfully" , data:data})
                })
                .catch(err => console.log(err))
            })
            .catch(err=>console.log(err))
        }
        else{
            console.log('user is Not exist in MongoDB')
        }
    })
    
    //Cart.find()
    // await CartItem.updateOne(filter,update)
    // .then((data)=>{
    //     if(data){
    //         CartItem.find({}).populate('productInfo')
    //         .then(data=>{
    //             return res.json({message : "updated Successfully" , data:data})
    //         })
    //         .catch(err => console.log(err))
            
    //     }
    //     else{
    //         console.log(`some issue is occured`)
    //     }
    // })
    // .catch((err)=> console.log(err))
}
//Delete cartItem
//1-check productExist
//2-then delete that cartItem which have productId
//3-return the remain cartitem in cartItem's Table
exports.delete =async(req,res)=>{
    console.log(`Del API HIT`)

    console.log(req.data)
    // const Qty = req.body.Qty
    const id = req.body.productInfo._id
    // console.log(`id : ${id}`)
    await CartItem.findOneAndDelete({'productInfo' : id})
    .then(async  function(result,err){
        if(result){
            console.log(`result payload : ${result}`)
            await CartItem.find({}).populate('productInfo')
            .then((data) =>{
                // console.log(data)
                res.send(data)
            } )
            .catch(err => console.log(err))
        }
        else{
            console.log(`err : ${err}`)
        }
    })
    .catch(err=> console.log(err))
}