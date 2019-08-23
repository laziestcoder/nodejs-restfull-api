const express = require('express');
const router = express.Router();

router.get('/', (req, resp, next) => { 
    resp.status(200).json({
        message: 'Handling GET requests to /products'
    });
});


router.post('/', (req, resp, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
    }; 
    
    resp.status(200).json({
        message: 'Handling POST requests to /products',
        createdProduct: product,
    });
});

router.get('/:productId', (req, resp, next) => { 
    const id = req.params.productId;
    if(id === 'special' ){
    resp.status(200).json({
        message: 'You discovered the special ID',
        id: id,
    });
    }else{
        resp.status(200).json({
            message: 'You passed an ID',
            id: id

        });
    }
});

router.patch('/:productId', (req, resp, next) => { 
    resp.status(200).json({
        message: 'Updated Product!',
       
    });
});

router.delete('/:productId', (req, resp, next) => { 
    resp.status(200).json({
        message: 'Deleted Product!',
        
    });
});

module.exports = router;