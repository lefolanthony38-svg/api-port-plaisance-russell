/**
 * @fileoverview Contrôleur de l'API REST des réservations, sous-ressource des catways.
 * Une réservation ne peut pas se terminer avant son début et ne peut pas
 * chevaucher une autre réservation du même catway.
 * @module controllers/reservationController
 */
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Vérifie les règles de gestion d'une réservation : dates cohérentes et
 * absence de chevauchement avec une autre réservation du même catway.
 * Les champs manquants sont laissés au contrôle du modèle Mongoose.
 * @async
 * @param {(string|number)} catwayNumber - Numéro du catway concerné.
 * @param {string} startDate - Date de début.
 * @param {string} endDate - Date de fin.
 * @param {string} [excludeId] - Identifiant d'une réservation à ignorer (cas d'une modification).
 * @returns {Promise<(string|null)>} Message d'erreur, ou null si tout est valide.
 */
const checkReservationRules = async (catwayNumber, startDate, endDate, excludeId) => {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return 'Les dates saisies sont invalides';
  }
  if (end < start) {
    return 'La date de fin ne peut pas être antérieure à la date de début';
  }

  const filter = {
    catwayNumber,
    startDate: { $lte: end },
    endDate: { $gte: start },
  };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  const conflict = await Reservation.findOne(filter);
  if (conflict) {
    return 'Ce catway est déjà réservé sur tout ou partie de cette période';
  }
  return null;
};

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
 * Crée une réservation pour un catway existant, après contrôle des dates.
 * Route : POST /catways/:id/reservations
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway, req.body : clientName, boatName, startDate, endDate).
 * @param {import('express').Response} res - Réponse Express (201 avec la réservation créée, 400 si les données sont invalides ou en conflit, 404 si le catway n'existe pas).
 * @returns {Promise<void>}
 */
exports.createReservation = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }

    const ruleError = await checkReservationRules(
      req.params.id,
      req.body.startDate,
      req.body.endDate
    );
    if (ruleError) {
      return res.status(400).json({ message: ruleError });
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
 * Modifie une réservation d'un catway, après contrôle des dates.
 * Route : PUT /catways/:id/reservations/:idReservation
 * @async
 * @param {import('express').Request} req - Requête Express (req.params : id et idReservation, req.body : clientName, boatName, startDate, endDate).
 * @param {import('express').Response} res - Réponse Express (200 avec la réservation modifiée, 400 ou 404 en cas d'erreur).
 * @returns {Promise<void>}
 */
exports.updateReservation = async (req, res) => {
  try {
    const ruleError = await checkReservationRules(
      req.params.id,
      req.body.startDate,
      req.body.endDate,
      req.params.idReservation
    );
    if (ruleError) {
      return res.status(400).json({ message: ruleError });
    }

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