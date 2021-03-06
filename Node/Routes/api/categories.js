//Routes/api/categories
const express = require('express');
const router = express.Router()
const multer = require("multer");

//Load Model 
const CategoryModel = require('../../models/Category')
//Multer Config
//Store Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/img/Category')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '-' +file.originalname )
  }
})
//receive Single file
const upload = multer({ storage: storage });
//Custom Routes
//HOME Routes
router.get('/', (req, res) => {
    CategoryModel.find((err ,docs)=>{
        if(!err){
            //console.log(docs)
            res.end('data is find in mongo')
        }
        else{
            console.log(err)
        }
    })
  });
//Send Data to MonogoDB 
router.post('/admin/addcategory' , upload.any() , 
    async (req,res) => {
      // console.log(req)
      // console.log("Send Data Api is Hit")
      // console.log(req.files)
    const newData = new CategoryModel();
    newData.Name = req.body.title;
    newData.Description = req.body.desc;
    newData.img = req.files[0].filename;
    newData.status = req.body.status;
    await newData.save()
return res.json({message:"yes"})
})
//Retrive Data from Mongo
router.get('/admin/listcategory' , (req,res) => {
  CategoryModel.find({})
  .then(data =>{
      res.json(data)
      console.log(data)
    } 
  )
  .catch(err => console.log("Error from Get RES"+data))
})
//Findone data from Mongo on ID
router.get('/admin/editcategory/:id' ,(req,res) => {
  //console.log('Hit POST router /admin/editcategory/:id');
  const {id}= req.params
  CategoryModel.findOne({_id : id})
  .then( data => {
    res.json(data)
    //console.log(data)
  })
  .catch(err => console.log(err))
})
//UPDATE Category
router.put("/admin/editcategory/:id" ,upload.any(), (req,res)=> {
  console.log("PUT api is Hit UPDATE Category")
  // console.log(req)
  // console.log(req.params)
  // console.log(req.files)
  //console.log(req.files[0].filename)
  //console.log(req.files)
  const {id}=req.params;
  CategoryModel.findOneAndUpdate({_id : id },{
    Name : req.body.title,
    Description : req.body.desc ,
    img : req.body.image,
    status : req.body.status
  }
  )
  .then(data => res.json({messge : "Data is updated"}))
  .catch(err => console.log(err))
})
//DELETE Category
router.delete("/admin/delete",(req,res)=> {
  console.log("DEL API is hit DELETE Category")
  //console.log(req.body.Uni)
  CategoryModel.findOneAndRemove(req.body.Uni , (err , data) => {
    if(!err){
      console.log(data)
    }
  })
  .then(data => res.json({messgae : "Data is Deleted"}))
  .catch(err => console.log(err))
})

module.exports = router;