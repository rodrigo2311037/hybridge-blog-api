// Este archivo maneja las operaciones relacionadas con la autenticación
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');


exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ name, email, password: hash });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = (req, res) => {
  console.log('REQ.USER:', req.user);
  const payload = { id: req.user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, token_type: 'Bearer' });
};

exports.profile = (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    msg: 'Acceso concedido 👋'
  });
};
