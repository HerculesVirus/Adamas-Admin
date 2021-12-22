//Routes/api/PublicPage/categories
const express = require('express')
const router = express.Router()
const multer = require("multer");
const jwt = require('jsonwebtoken')
//Load Model 
const CategoryModel = require('../../models/Category')
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

//General
router.get('/publicsite/categries', (req,res) => {
    CategoryModel.find({})
    .then( data => res.json(data))
    .catch(err => console.log(err))
})



