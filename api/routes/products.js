const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

//Image Uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname);//original name 
        cb(null, new Date().toISOString().replace(/[-T:\.Z]/g, "") + file.originalname);//changed name 
    }
});
const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //accept file
        cb(null, true); // null can be replaced by error

    } else {
        //reject a file
        // cb(null, false);
        cb(new Error('File Type Error'), false);
    }



};
//const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3, // 5 MB files only
    },
    fileFilter: fileFilter,
});



router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.products_update_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete);


module.exports = router;