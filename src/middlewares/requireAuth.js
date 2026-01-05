// middlewares/requireAuth.js
const passport = require('passport');

// Atajo elegante: middleware reutilizable para proteger rutas
module.exports = passport.authenticate('jwt', { session: false });
