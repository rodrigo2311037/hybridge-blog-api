// Este archivo define las rutas relacionadas con la autenticación
const express = require('express');
const passport = require('passport');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', controller.signup);

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  controller.login
);

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  controller.profile
);

module.exports = router;
