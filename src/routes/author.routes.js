const express = require('express');
const controller = require('../controllers/author.controller');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/', requireAuth, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
