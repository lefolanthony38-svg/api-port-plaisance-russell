/**
 * @fileoverview Contrôleur des pages affichées dans le navigateur
 * (catways, réservations, utilisateurs).
 * @module controllers/viewController
 */
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

/**
 * Affiche la page de gestion des catways.
 * Route : GET /catways-view
 * @async
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express (vue catways).
 * @returns {Promise<void>}
 */
exports.catwaysPage = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('catways', { catways });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche la page de détail d'un catway et de ses réservations.
 * Route : GET /catways-view/:id
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway).
 * @param {import('express').Response} res - Réponse Express (vue catway-detail, ou 404).
 * @returns {Promise<void>}
 */
exports.catwayDetailPage = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).send('Catway non trouvé');
    }
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    }).sort({ startDate: 1 });
    res.render('catway-detail', { catway, reservations });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche la page de gestion des réservations.
 * Route : GET /reservations-view
 * @async
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express (vue reservations).
 * @returns {Promise<void>}
 */
exports.reservationsPage = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('reservations', { reservations, catways });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche la page de gestion des utilisateurs.
 * Route : GET /users-view
 * @async
 * @param {import('express').Request} req - Requête Express (req.user : utilisateur connecté).
 * @param {import('express').Response} res - Réponse Express (vue users).
 * @returns {Promise<void>}
 */
exports.usersPage = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ username: 1 });
    res.render('users', {
      users,
      currentEmail: req.user.email,
      adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

/**
 * Affiche la page de détail d'un utilisateur.
 * Route : GET /users-view/:email
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.email : email de l'utilisateur).
 * @param {import('express').Response} res - Réponse Express (vue user-detail, ou 404).
 * @returns {Promise<void>}
 */
exports.userDetailPage = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.render('user-detail', { user });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};