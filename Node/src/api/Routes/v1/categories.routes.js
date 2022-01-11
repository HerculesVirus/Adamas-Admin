//Routes/api/categories
const express = require('express');
const { uploadCategory } = require("../../util/multer")
const controller = require('../../controllers/category.controller')

const router = express.Router()

//Custom Routes
router.route('/').get( controller.retrieveCategoryIsExist );
router.route('/addcategory').post( uploadCategory.any() ,  controller.createCategory )
router.route('/listcategory').get(controller.retrieveAllCategories )
router.route('/editcategory/:id').get( controller.retrieveOneCategory )
router.route('/editcategory/:id').put( uploadCategory.any(), controller.updateCategory )
router.route('/delete').delete( controller.deleteCategory )

module.exports = router;