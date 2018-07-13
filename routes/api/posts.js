const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//post model
const Post = require('../../models/Post');
//profile
const Profile = require('../../models/Profile');
//post validatation
const validatePostInput = require('../../validation/post');

//@get    GET api/posts/test
//@desc   tests post route
//@access public

router.get('/test', (req, res) => {
  res.json({
    msg: 'Posts is working'
  });
});

//@post   POST api/posts
//@desc   create a post
//@access private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //checking validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => {
      res.json(post);
    });
  }
);

//@get    GET api/posts
//@desc   see posts
//@access public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(e => res.status(404).json({ noPostsFound: 'No posts found' }));
});

//@get    GET api/posts by id
//@desc   see post
//@access public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)

    .then(post => {
      res.json(post);
    })
    .catch(e =>
      res.status(404).json({ noPostFound: 'No post found with that id' })
    );
});

//@delete    DELETE api/posts by id
//@desc   see post
//@access public
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: 'User not authorized' });
        }

        //delete
        post
          .remove()
          .then(() => {
            res.json({ success: true });
          })
          .catch(e => res.status(404).json({ postnotfound: 'Post not found' }));
      });
    });
  }
);

//@post  api/like/:id
//@desc   like a post
//@access private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(404)
              .json({ alreadyLiked: 'User has already liked this post' });
          }

          //add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => {
            res.json(post);
          });
        })
        .catch(e => res.status(404).json({ postnotfound: 'Post not found' }));
    });
  }
);

//@post  api/unlike/:id
//@desc   unlike a post
//@access private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(404)
              .json({ haventliked: 'You have not liked this post' });
          }

          //get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //splice out of array
          post.likes.splice(removeIndex, 1);

          post.save().then(post => {
            res.json(post);
          });
        })
        .catch(e => res.status(404).json({ postnotfound: 'Post not found' }));
    });
  }
);
module.exports = router;
