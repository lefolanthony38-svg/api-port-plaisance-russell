const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const reservationRoutes = require('../routes/reservationRoutes');

router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById);
router.post('/', catwayController.createCatway);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);

router.use('/:id/reservations', reservationRoutes);

module.exports = router;