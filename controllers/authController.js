/**
 * @fileoverview Contrôleur d'authentification (connexion, déconnexion)
 * et du tableau de bord.
 * @module controllers/authController
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

/**
 * Connecte un utilisateur. Si l'email et le mot de passe sont corrects,
 * un token JWT valable 2 heures est déposé dans un cookie et l'utilisateur
 * est redirigé vers le tableau de bord. Sinon, la page d'accueil est
 * réaffichée avec un message d'erreur.
 * Route : POST /login
 * @async
 * @param {import('express').Request} req - Requête Express (req.body : email, password).
 * @param {import('express').Response} res - Réponse Express.
 * @returns {Promise<void>}
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('index', { error: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('index', { error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Déconnecte l'utilisateur : supprime le cookie « token »
 * puis redirige vers la page d'accueil.
 * Route : GET /logout
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @returns {void}
 */
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};

/**
 * Affiche le tableau de bord : informations de l'utilisateur connecté,
 * date du jour et réservations en cours.
 * Route : GET /dashboard
 * @async
 * @param {import('express').Request} req - Requête Express (req.user : utilisateur décodé du token).
 * @param {import('express').Response} res - Réponse Express (page dashboard).
 * @returns {Promise<void>}
 */
exports.dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    const reservations = await Reservation.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    res.render('dashboard', { user, reservations });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};