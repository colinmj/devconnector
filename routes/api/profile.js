const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//load profile model
const Profile = require('../../models/Profile');

//load user profile
const { User } = require('../../models/User');

// we already have api/users accounted for

//@get    GET api/profile
//@desc   get current users profile
//@access private

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({
      user: req.user.id
    })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(e => {
        res.status(404).json(e);
      });
  }
);

//@route  GET api/profile/all/
//@desc   get all profiles
//@access public

router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfiles = 'There are no profiles at this time';
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({
        profile: 'No Profiles'
      })
    );
});

//@route  GET api/profile/handle/:handle
//@desc   get profile by handle
//@access public

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({
    handle: req.params.handle
  })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for that user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

//@route  GET api/profile/user/:user_id
//@desc   get profile by user id
//@access public

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({
    user: req.params.user_id
  })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for that user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e =>
      res.status(404).json({
        profile: 'There is no profile for this user'
      })
    );
});

//@post    POST api/profile
//@desc   create or edit users profile
//@access private

router.post(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    //get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    //skills
    if (typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(',');
    }

    //social
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: profileFields
          },
          {
            new: true
          }
        ).then(profile => {
          res.json(profile);
        });
      } else {
        //create
        // check if handle exists
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json({ errors });
          }

          //save the profile
          new Profile(profileFields).save().then(savedProfile => {
            res.json(savedProfile);
          });
        });
      }
    });
  }
);

//@route  POST api/profile/experience
//@desc   add experience to profile
//@access private

router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add to experience array
      profile.experience.unshift(newExp);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//@route  POST api/profile/education
//@desc   add experience to profile
//@access private

router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //add to experience array
      profile.education.unshift(newEdu);
      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

//@route  Delete api/profile/experience/:exp_id
//@desc   delete experience from profile
//@access private

router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      //get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //splice out of array
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(e => res.status(404).json(e));
    });
  }
);

//@route  Delete api/profile/experience/:exp_id
//@desc   delete experience from profile
//@access private

router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      //get remove index
      const removeIndex = profile.education
        .map(item => item.id) //this was id
        .indexOf(req.params.edu_id);

      //splice out of array
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => {
          res.json(profile);
        })
        .catch(e => res.status(404).json(e));
    });
  }
);

//@route  Delete api/profile
//@desc   delete user and profile
//@access private

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({
      user: req.user.id
    }).then(() => {
      User.findOneAndRemove({
        _id: req.user.id
      }).then(() => {
        res.json({
          success: true
        });
      });
    });
  }
);

module.exports = router;
