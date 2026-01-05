// Este archivo configura la aplicación Express
const express = require('express');
const passport = require('passport');
require('dotenv').config();

require('./config/passport');

const app = express();

app.use(express.json());
app.use(passport.initialize());

// debug rapido
// console.log(require('./routes/auth.routes'));

// Rutas
app.use('/api', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/authors', require('./routes/author.routes'));

// Ruta Home
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Hybridge Blog Posts' });
});

module.exports = app;
