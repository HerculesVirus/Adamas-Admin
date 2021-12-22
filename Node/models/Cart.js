const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    USER_ID : {
        type : String,
        required : true 
    }
},{timestamp : true})

const Cart = mongoose.model('Cart' ,cartSchema)
module.exports =Cart

