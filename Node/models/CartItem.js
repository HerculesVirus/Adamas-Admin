const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    cartId : {
        type : String ,
        required : true
    },
    productId : {
        type : String ,
        required : true
    },
    Qty : {
        type : Number ,
        required : true
    }
})

const quantity = mongoose.model('CartItem' , cartItemSchema)
module.exports = quantity;