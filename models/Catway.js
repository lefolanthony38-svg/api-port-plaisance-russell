/**
 * @fileoverview Modèle Mongoose d'un catway (petit appontement pour amarrer un bateau).
 * @module models/Catway
 */
const mongoose = require('mongoose');

/**
 * Schéma d'un catway.
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro du catway (unique).
 * @property {('long'|'short')} catwayType - Type du catway.
 * @property {string} catwayState - Description de l'état de la passerelle.
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro de catway est obligatoire'],
    unique: true,
  },
  catwayType: {
    type: String,
    required: [true, 'Le type de catway est obligatoire'],
    enum: {
      values: ['long', 'short'],
      message: 'Le type doit être "long" ou "short"',
    },
  },
  catwayState: {
    type: String,
    required: [true, "L'état du catway est obligatoire"],
  },
});

module.exports = mongoose.model('Catway', catwaySchema);