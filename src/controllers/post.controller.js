// Este archivo maneja las operaciones relacionadas con los posts

const e = require('express');
const { Post, Author } = require('../models');

exports.create = async (req, res) => {
  const { title, content, authorId } = req.body;
  if (!title || !content || !authorId) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const post = await Post.create({ title, content, authorId });
  res.status(201).json(post);
};

exports.getAll = async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
};

exports.getOne = async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: { model: Author, attributes: ['id', 'name'] }
  });

  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  res.json(post);
};

exports.update = async (req, res) => {
    const { title, content } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    
    await post.save();
    res.json(post);
};

exports.delete = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });

  // Soft delete: marcar como eliminado sin borrar físicamente
   await post.destroy(); // soft delete
    res.json({ message: "Post eliminado correctamente" });
};