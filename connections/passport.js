const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');


const User = require('../models/usersModel');

passport.use(new GoogleStrategy({
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: "http://localhost:3000/users/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    const user = await User.findOne({ googleId: profile.id });
    if(user) {
      console.log('使用者已存在');
      return cb(null, user);
    }

    const password = await bcrypt.hash('K10q6Wbk0xC6VoYdebBa', 12);
    const newUser = await User.create({
      email: profile.emails[0].value,
      name: profile.displayName,
      password,
      googleId: profile.id
    })
    return cb(null, newUser);
  }
));