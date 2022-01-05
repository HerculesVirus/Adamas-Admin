const multer = require("multer");

//Store Image of Product
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './src/uploads/img/Product')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
//receive Single file
exports.uploadProduct = multer({ storage: storage });

//Store Image of Category
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './src/uploads/img/Category')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now() + '-' +file.originalname )
  }
})
//receive Single file
exports.uploadCategory = multer({ storage: storage });
