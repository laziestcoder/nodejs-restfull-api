const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

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



router.get('/', (req, resp, next) => {
    //dummy code
    // resp.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id,
                        }
                    }
                }),
            };
            //console.log("From Database",docs);
            // if(docs.length >= 0 ){
            resp.status(200).json(response); //200 is OK
            // }else{
            //     resp.status(404).json({
            //         message: "No Valid Data Found",
            //     });
            // }

        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            })
        });
});


router.post('/', upload.single('productImage'), (req, resp, next) => {
    //dummy code
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price,
    // }; 
    //console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
    });
    product.save()
        .then(result => {
            console.log(result);
            resp.status(201).json({ // 201 is Created Successfully
                message: 'Created product successfully!',
                //createdProduct: result,
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id,

                    },

                },
            });
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });

});

router.get('/:productId', (req, resp, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if (doc) {
                resp.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCT',
                        url: "http://localhost:3000/products",
                    }
                });
            } else {
                resp.status(404).json({
                    message: "No Valid Data Found for Provded ID",
                });
            }

        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({ error: err });
        });
    //dummy code
    // if(id === 'special' ){
    // resp.status(200).json({
    //     message: 'You discovered the special ID',
    //     id: id,
    // });
    // }else{
    //     resp.status(200).json({
    //         message: 'You passed an ID',
    //         id: id

    //     });
    // }
});

router.patch('/:productId', (req, resp, next) => {
    //dummy code
    // resp.status(200).json({
    //     message: 'Updated Product!',

    // });
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            //console.log(result);
            resp.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products" + _id
                },
            });
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, resp, next) => {
    //dummy code
    // resp.status(200).json({
    //     message: 'Deleted Product!',
    // });

    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            resp.status(200).json({
                message: "Product Deleted",
                request: {
                    type: 'POST',
                    url: "http://localhost:3000/products",
                    body: {
                        name: 'String',
                        price: 'Number',
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            resp.status(500).json({
                error: err
            });
        });
});

module.exports = router;