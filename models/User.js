/**
 * @fileoverview Modèle Mongoose d'un utilisateur de la capitainerie.
 * Le mot de passe est chiffré (bcrypt) avant chaque enregistrement.
 * @module models/User
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Schéma d'un utilisateur.
 * @typedef {Object} User
 * @property {string} username - Nom d'utilisateur.
 * @property {string} email - Adresse de messagerie (unique, en minuscules).
 * @property {string} password - Mot de passe (8 caractères minimum, stocké chiffré).
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est obligatoire"],
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
  },
});

/**
 * Hook exécuté avant chaque enregistrement : chiffre le mot de passe
 * uniquement s'il a été créé ou modifié.
 * @async
 * @returns {Promise<void>}
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compare un mot de passe en clair avec le mot de passe chiffré de l'utilisateur.
 * @param {string} candidatePassword - Mot de passe saisi à la connexion.
 * @returns {Promise<boolean>} true si le mot de passe correspond.
 */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);