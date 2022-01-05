
//LoadModel 
const Product = require('../models/Product')
//CheckIsProductExistOrNot
exports.retrieveProductIsExist = async (req, res) => {
    await Product.find((err ,docs)=>{
        if(!err){
            //console.log(docs)
            res.end('data is find in mongo')
        }
        else{
            console.log(err)
        }
    })
}
//RetieveAllProduct
exports.retieveAllProduct = async (req,res) => {
    await Product.find({})
    .then(data => res.json(data)  ) //console.log(data)
    .catch(err => console.log("Error from Get REST API"+data))
}
//CreateOneProduct
exports.createProduct = async(req,res) => {
    console.log("Post  API is Hit /admin/createProduct")
    const newData = new Product();
    newData.Name = req.body.title
    newData.Description = req.body.desc
    newData.img = req.files[0].filename
    newData.Featured= req.body.status
    newData.price = req.body.price
    newData.Category.name = req.body.Category
    newData.Category.id = req.body.Cat_ID
    await newData.save()
return res.json({message : "Yes"})
} 
//GetOneProduct
exports.retrieveOneProduct = async (req,res) => {
    console.log('Hit POST router /admin/editcategory/:id');
    // console.log(req.body)
    const {id }= req.params
    await Product.findOne({_id : id})
    .then( data => {
      res.json(data)
    //   console.log(data)
    })
    .catch(err => console.log(err))
}
//UpdateOneProduct
exports.updateOneProduct = async (req,res)=> {
    console.log("PUT api is Hit UPDATE Category")
    //console.log(req.body)
    const {id}  = req.params
    const filter = {_id : id }
    const update = {
        Name : req.body.title,
        Description : req.body.desc ,
        img : req.body.images,
        Featured : req.body.status , 
        price : req.body.price,
        Category:{
          name : req.body.name,
          id : req.body.Cat_ID
        }
    }
    await Product.findOneAndUpdate(filter,update)
    .then(data => res.json({messgae : "Data is updated"}))
    .catch(err => console.log(err))
}
//DeleteOneProduct
exports.deleteOneProduct = async (req,res)=> {
    console.log("DEL API is hit DELETE Category")
    //console.log(req.body.Uni)
    await Product.findOneAndRemove(req.body.Uni , (err , data) => {
      if(!err){
        console.log(data)
      }
    })
    .then(data => res.json({messgae : "Data is Deleted"}))
    .catch(err => console.log(err))
}