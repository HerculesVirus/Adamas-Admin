//Routes/api/products
const express = require('express')
const {uploadProduct} = require("../../util/multer")
const controller = require('../../controllers/product.controller')
const router = express.Router()

//Custom Routes
//HOME Routes
router.route("/").get(controller.retrieveProductIsExist);
router.route("/createproduct").post(uploadProduct.any() , controller.createProduct)
router.route("/listproduct").get(controller.retieveAllProduct)
router.route("/editproduct/:id").get(controller.retrieveOneProduct)
router.route("/editproduct/:id").put(uploadProduct.any(),controller.updateOneProduct)
router.route("/deleteproduct").delete(controller.deleteOneProduct)

module.exports = router;