const express = require('express');
const router = express.Router();


//handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({ // 200 is OK
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
    };
    res.status(201).json({ // 201 for creted response
        message: 'Order was created',
        order: order,
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;