const express = require('express');
const controller = require('../../../site-controller/site-product.controller')
const router = express.Router();

//Routes
router.route('/product').get(controller.retrieveAllProduct)
router.route('/product/featured').get(controller.retrieveFeaturedProducts)
router.route('/product/latest').get(controller.retrieveLatestProducts)
router.route('/category/product').get(controller.retrieveShopProducts)
router.route('/ProductPreview/:id').get(controller.retrieveOneProductPreview)

module.exports =router