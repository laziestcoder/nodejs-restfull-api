const express = require('express'); // express package
const app = express();
const morgan = require('morgan'); // morgan package,its a login package for Nodejs
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS Errors
app.use((req,resp,next) => {
    resp.header('Access-Control-Allow-Origin','*'); //API Access for everyting (*). It can be a single server also like http://ownsite.address
    resp.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        resp.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return resp.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req,resp,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,resp,next) => {
    resp.status(error.status || 500);
    resp.json({
        error:{
            message: error.message,
        }
    });
});

module.exports = app;