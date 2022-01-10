const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    USER_ID : {
        type : String,
        required : true 
    },
    status:{
        type : Number
    }
},
{timestamps :{createdAt: 'created_on' , updatedAt : 'updated_on'}})

const Cart = mongoose.model('Cart' ,cartSchema)
module.exports =Cart

