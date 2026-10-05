/**
 * @fileoverview Modèle Mongoose d'une réservation de catway.
 * @module models/Reservation
 */
const mongoose = require('mongoose');

/**
 * Schéma d'une réservation.
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro du catway réservé.
 * @property {string} clientName - Nom du client ayant effectué la réservation.
 * @property {string} boatName - Nom du bateau amarré.
 * @property {Date} startDate - Date de début de la réservation.
 * @property {Date} endDate - Date de fin de la réservation.
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est obligatoire'],
  },
  clientName: {
    type: String,
    required: [true, 'Le nom du client est obligatoire'],
  },
  boatName: {
    type: String,
    required: [true, 'Le nom du bateau est obligatoire'],
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est obligatoire'],
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est obligatoire'],
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);