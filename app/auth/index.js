'use strict';

const passport = require('passport');
const config = require('../config');
const TwitterStrategy = require('passport-twitter').Strategy;
const h = require('../helpers');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Find the user using the _id
    h.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('Error when deserializing the user'));
  });

  let authProcessor = (token, tokenSecret, profile, done) => {
    // Find a user in the local db using profile.id
    // If the user is found, return the user data using the done method
    // If the user is not found, create one
    h.findOne(profile.id)
      .then(result => {
        if (result) {
          done(null, result);
        } else {
          // Create a new user and return
          h.createNewUser(profile)
            .then(newUser => done(null, newUser))
            .catch(error => console.log('Error when creating new user'));
        }
      });
  }

  passport.use(new TwitterStrategy(config.twitter, authProcessor));
}
