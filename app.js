const express = require('express'); // express package
const app = express();
const morgan = require('morgan'); // morgan package,its a login package for Nodejs
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Mongoose bug fix
//mongoose.Promise = global.Promise;
//mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//mongoose.set('ensureIndex', false);

//Routing
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//DB Connection
mongoose.connect('mongodb+srv://laziestcoder:'+ process.env.MONGO_ATLAS_PW +
'@nodejs-restfull-api-b2crm.mongodb.net/test?retryWrites=true&w=majority',//address of DB and Host between ''
{
   // useMongoClient: true, // 5.xx doesn't have this features
   useNewUrlParser: true,
});



app.use(morgan('dev'));
// app.use(express.static('uploads'));
app.use('/uploads',express.static('uploads'));
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



app.use((req,resp,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((req,resp,next) => {
    const error = new Error('Data Conflicts');
    error.status = 409;
    next(error);
});
app.use((req,resp,next) => {
    const error = new Error('Unprocessable Entity');
    error.status = 422;
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
app.use((error,req,resp,next) => {
    resp.status(error.status);
    resp.json({
        error:{
            message: error.message,
        }
    });
});

module.exports = app;