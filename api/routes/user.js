const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  console.log(res.body.email);
  //console.log(req.body.password);
  //console.log(res.status());
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({ // 409 conflict, 422 unprocessable entity
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//GET ALL 

router.get('/', (req, res, next) => {
  // res.status(200).json({ // 200 is OK
  //     message: 'Orders were fetched'
  // });
  User.find()
     // .select("product quantity _id")
     // .populate('product', 'name')
      .exec()
      .then(docs => {
          res.status(200).json({
              count: docs.length,
              users: docs.map(doc => {
                  return {
                      _id: doc._id,
                      email: doc.email,
                      password: doc.password,
                      request: {
                          type: "GET",
                          url: "http://localhost:3000/user/" + doc._id
                      }
                  };
              })
          });
      })
      .catch(err => {
          res.status(500).json({
              error: err
          });
      });
});

module.exports = router; 