const express = require('express');
const router = express.Router();

// we already have api/users accounted for

//@get    GET api/profile/test
//@desc   tests profile route
//@access public

router.get('/test', (req, res) => {
  res.json({
    msg: 'Profile is working'
  });
});

module.exports = router;
