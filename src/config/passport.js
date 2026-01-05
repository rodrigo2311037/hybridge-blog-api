const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

//estrategia Local
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: false },
    async (email, password, done) => {
      try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return done(null, false);
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return done(null, false);
        return done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);


// JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await db.User.findByPk(payload.id);
        return user ? done(null, user) : done(null, false);
      } catch (e) {
        done(e, false);
      }
    }
  )
);
