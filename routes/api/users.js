const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//load user model
const { User } = require('../../models/User');

// we already have api/users accounted for

//@get    GET api/users/test
//@desc   tests users route
//@access public

router.get('/test', (req, res) => {
  res.json({
    msg: 'Users is working'
  });
});

//@get    GET api/users/register
//@desc   Register a user
//@access public

router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    }
  });
  const avatar = gravatar.url(req.body.email, {
    s: 200, // size
    rating: 'pg',
    default: 'mm'
  });
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    avatar,
    password: req.body.password
  });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(user => {
          res.json(user);
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

//@get    GET api/users/login
//@desc   login a user/ returning token
//@access public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find the user by email
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }
    // check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' });
      } else {
        return res.status(400).json({ password: 'Password is incorrect' });
      }
    });
  });
});

module.exports = router;
