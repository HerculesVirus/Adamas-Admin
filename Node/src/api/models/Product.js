const mongoose = require('mongoose')
const Category = require('./Category')

const productSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Description:{
        type: String
    },
    img:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required : true
    },
    Category:{
        name : {
            type: String,
            required : true
        },
        id:{
            type: String,
            required : true  
        }
    },
    Featured:{
        type : Boolean
    }
},{timestamps : true})

const Product = mongoose.model('Product',productSchema)
module.exports = Product