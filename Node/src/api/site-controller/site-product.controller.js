//LoadModel
const Product = require('../models/Product')

//It is used in Home Page
exports.retrieveAllProduct = async (req,res) => {
    await Product.find({})
    .then( data => res.json(data))
    .catch(err => console.log(err))
}
//For Featured Products
exports.retrieveFeaturedProducts = async (req,res) => {
    await Product.find({Featured : 'true'})
    .then((data)=>{
        if(data){
            //array of object is I think given to me
            //console.log(`Featured product : ${data}`)
            res.json(data)
        }
        else{
            console.log(`No Featured Product is exist`)
        }
    })
};
//New Arrival Products
exports.retrieveLatestProducts = async (req,res) => {
    await Product.find({Featured : 'false'})
    .then((data)=>{
        if(data){
            //array of object
            //console.log(`Featured product : ${data}`)
            res.json(data)
        }
        else{
            console.log(`No Featured Product is exist`)
        }
    })
    .catch((err)=>console.log(err))
};
//CategoryShop publicsite/category/product
exports.retrieveShopProducts = async (req,res) => {
    const PAGE_SIZE = 3
    const page = parseInt(req.query.page || "0");
    //Category.id
    const {id} =req.query
    // console.log("before id")
    // console.log(id)
    // console.log(typeof id)
    if(id && typeof id !== undefined && id !=="null" ){
        // console.log('IF get by ids : '+id)
        //If Category with ID is given
        const total = await Product.countDocuments({"Category.id" : id});
        await Product.find({"Category.id" : id})
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page)
        .then(data =>{
            res.json({totalPages: Math.ceil(total /PAGE_SIZE), data})
        })
        .catch(err =>{
            console.log(err)
            return;
        })
    }
    else{
        console.log('ELSE ALL documents : ')
        const total = await Product.countDocuments({});
        // console.log(total)
        await Product.find({})
        .limit(PAGE_SIZE)
        .skip(PAGE_SIZE * page)
        .then( data => {
            res.json({totalPages: Math.ceil(total /PAGE_SIZE), data})
        })
        .catch(err =>{
            console.log(err)
            return;
        })
    }

}
//GetOneProduct
exports.retrieveOneProductPreview =  async(req,res)=> {
    const { id } = req.params
    console.log(`retrieveOneProductPreview findOne :  ${id}`)
    if(id){
        Product.findOne({ _id : id })
        .then( data => res.json(data))
        .catch(err => console.log(err)) 
    }
    else{
        console.log(`Could not find the Id of the Product`)
    }
}
