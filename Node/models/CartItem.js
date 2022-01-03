const mongoose = require('mongoose')
const product = require('./Product')

const cartItemSchema = new mongoose.Schema({
    cartId : {
        type : String ,
        required : true
    },
    productInfo : {
        type : mongoose.ObjectId ,
        ref : product ,
        required : true 
    },
    Qty : {
        type : Number ,
        required : true
    }
})

const quantity = mongoose.model('CartItem' , cartItemSchema)
module.exports = quantity;