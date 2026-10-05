/**
 * @fileoverview Contrôleur de l'API REST des réservations, sous-ressource des catways.
 * @module controllers/reservationController
 */
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Liste les réservations d'un catway.
 * Route : GET /catways/:id/reservations
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway).
 * @param {import('express').Response} res - Réponse Express (200 avec le tableau des réservations).
 * @returns {Promise<void>}
 */
exports.getReservationsByCatway = async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupère les détails d'une réservation d'un catway.
 * Route : GET /catways/:id/reservations/:idReservation
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway, req.params.idReservation : identifiant de la réservation).
 * @param {import('express').Response} res - Réponse Express (200 avec la réservation, 404 si elle n'existe pas).
 * @returns {Promise<void>}
 */
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber: req.params.id,
    });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Crée une réservation pour un catway existant.
 * Route : POST /catways/:id/reservations
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway, req.body : clientName, boatName, startDate, endDate).
 * @param {import('express').Response} res - Réponse Express (201 avec la réservation créée, 400 si les données sont invalides, 404 si le catway n'existe pas).
 * @returns {Promise<void>}
 */
exports.createReservation = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }

    const newReservation = new Reservation({
      catwayNumber: req.params.id,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Modifie une réservation d'un catway.
 * Route : PUT /catways/:id/reservations/:idReservation
 * @async
 * @param {import('express').Request} req - Requête Express (req.params : id et idReservation, req.body : clientName, boatName, startDate, endDate).
 * @param {import('express').Response} res - Réponse Express (200 avec la réservation modifiée, 400 ou 404 en cas d'erreur).
 * @returns {Promise<void>}
 */
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.idReservation, catwayNumber: req.params.id },
      {
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
      { new: true, runValidators: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Supprime une réservation d'un catway.
 * Route : DELETE /catways/:id/reservations/:idReservation
 * @async
 * @param {import('express').Request} req - Requête Express (req.params : id et idReservation).
 * @param {import('express').Response} res - Réponse Express (200 avec un message, 404 si la réservation n'existe pas).
 * @returns {Promise<void>}
 */
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber: req.params.id,
    });
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};