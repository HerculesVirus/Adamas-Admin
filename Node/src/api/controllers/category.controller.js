
//LoadModel
const CategoryModel = require('../models/Category')
//Methods
//HOME Routes
exports.retrieveCategoryIsExist = async (req, res) => {
    await CategoryModel.find({})
    .then((err ,docs)=>{
        if(!err){
          console.log('are you here')
          res.send(`data is find in mongo ${docs}`)
        }
        else{
          console.log(err)
        }
    })
    .catch(err => console.log(err))
}
//Create Category
exports.createCategory = async (req,res) => {
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
}

exports.retrieveAllCategories = async (req,res) => {
    await CategoryModel.find({})
    .then(data =>{
        res.json(data)
        console.log(data)
      } 
    )
    .catch(err => console.log("Error from Get RES"+data))
}

//Findone data from Mongo on ID and Populate in editCategory
exports.retrieveOneCategory = async (req,res) => {
    //console.log('Hit POST router /admin/editcategory/:id');
    const {id}= req.params
    await CategoryModel.findOne({_id : id})
    .then( data => {
      res.json(data)
      //console.log(data)
    })
    .catch(err => console.log(err))
}

//UPDATE Category
exports.updateCategory = (req,res)=> {
    console.log("PUT api is Hit UPDATE Category")
    // console.log(req)
    // console.log(req.params)
    // console.log(req.files)
    //console.log(req.files[0].filename)
    //console.log(req.files)
    const {id}=req.params;
    const filter = {_id : id};
    const update = {
        Name : req.body.title,
        Description : req.body.desc ,
        img : req.body.image,
        status : req.body.status
    }
    CategoryModel.findOneAndUpdate(filter,update)
    .then(data => res.json({messge : "Data is updated"}))
    .catch(err => console.log(err))
}
//DELETE Category
exports.deleteCategory = async (req,res)=> {
    console.log("DEL API is hit DELETE Category")
    //console.log(req.body.Uni)
    await CategoryModel.findOneAndRemove(req.body.Uni , (err , data) => {
      if(!err){
        console.log(data)
      }
    })
    .then(data => res.json({messgae : "Data is Deleted"}))
    .catch(err => console.log(err))
  }


