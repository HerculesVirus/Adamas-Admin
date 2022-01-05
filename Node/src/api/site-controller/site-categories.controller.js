//LoadModel
const CategoryModel = require('../models/Category')

exports.retrieve = async (req,res) => {
    await CategoryModel.find({})
    .then( data => res.json(data))
    .catch(err => console.log(err))
}