const router = require('express').Router();
//....Admin Routes....
const categoriesRoutes = require('./categories.routes')
const productRoutes = require('./products.routes')
//....Site Routes.....
const site_authRoute = require("./site-route/site-auth.route")
const site_cartRoute = require("./site-route/site-cart.route")
const site_categoriesRoute = require("./site-route/site-categories.route")
const site_productRoute = require("./site-route/site-product.route")
const site_paymentRoute = require("./site-route/site-payment.route")
//admin
router.use('/category' , categoriesRoutes)
router.use('/product'  , productRoutes)
//site
router.use('/site-auth', site_authRoute)
router.use('/site-cart' , site_cartRoute)
router.use('/site-categories', site_categoriesRoute)
router.use('/site-product' , site_productRoute)
router.use('/site-payment' , site_paymentRoute)

module.exports = router;