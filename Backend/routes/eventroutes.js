const express = require('express');
const router = express.Router();
const {protect , admin} = require('../midlewares/authmiddleware.js');
const {getallevents, geteventbyid, createevent, updateevent, deleteevent} = require('../controllers/eventcontroller.js')

router.get('/', getallevents);
router.post('/:id', geteventbyid);
router.post('/', protect, admin, createevent)
router.put('/:id', protect, admin, updateevent)
router.delete('/:id', protect, admin, deleteevent);
module.exports = router