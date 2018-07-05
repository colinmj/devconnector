const express = require('express');
const router = express.Router();

// we already have api/users accounted for

//@get    GET api/posts/test
//@desc   tests post route
//@access public

router.get('/test', (req, res) => {
  res.json({
    msg: 'Posts is working'
  });
});

module.exports = router;
