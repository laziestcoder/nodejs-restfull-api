const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');


// router.post("/signup", (req, res, next) => {
//   const product = {
//         name: req.body.name,
//         price: req.body.price,
//     }; 

// });

router.post("/signup",  UserController.user_signup);


router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete);

//GET ALL 

// router.get('/', (req, res, next) => {
//   // res.status(200).json({ // 200 is OK
//   //     message: 'Orders were fetched'
//   // });
//   User.find()
//     // .select("product quantity _id")
//     // .populate('product', 'name')
//     .exec()
//     .then(docs => {
//       res.status(200).json({
//         count: docs.length,
//         users: docs.map(doc => {
//           return {
//             _id: doc._id,
//             email: doc.email,
//             password: doc.password,
//             request: {
//               type: "GET",
//               url: "http://localhost:3000/user/" + doc._id
//             }
//           };
//         })
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;