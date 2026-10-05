const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservationController');

router.get('/', reservationController.getReservationsByCatway);
router.get('/:idReservation', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.put('/:idReservation', reservationController.updateReservation);
router.delete('/:idReservation', reservationController.deleteReservation);

module.exports = router;