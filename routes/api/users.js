const express = require('express');
const router = express.Router();

// we already have api/users accounted for

//@get    GET api/users/test
//@desc   tests users route
//@access public

router.get('/test', (req, res) => {
  res.json({
    msg: 'Users is working'
  });
});

module.exports = router;
