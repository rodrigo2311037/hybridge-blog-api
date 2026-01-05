// Este archivo maneja las operaciones relacionadas con los autores
const { Author } = require('../models');

exports.create = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.length < 3) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }

  const author = await Author.create({ name });
  res.status(201).json(author);
};

exports.getAll = async (req, res) => {
  const authors = await Author.findAll();
  res.json(authors);
};

exports.getOne = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(author);
};

exports.update = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });

  author.name = req.body.name ?? author.name;
  await author.save();
  res.json(author);
};

exports.remove = async (req, res) => {
  const author = await Author.findByPk(req.params.id);
  if (!author) return res.status(404).json({ error: 'Autor no encontrado' });

  await author.destroy();
  res.json({ message: 'Autor eliminado correctamente' });
};
