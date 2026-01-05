// routes/post.routes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const controller = require('../controllers/post.controller');

router.post('/', requireAuth, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.delete);

module.exports = router;
