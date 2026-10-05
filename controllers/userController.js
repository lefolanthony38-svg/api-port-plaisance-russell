/**
 * @fileoverview Contrôleur de l'API REST des utilisateurs (opérations CRUD).
 * Le mot de passe n'est jamais renvoyé dans les réponses.
 * @module controllers/userController
 */
const User = require('../models/User');

/**
 * Liste tous les utilisateurs.
 * Route : GET /users
 * @async
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express (200 avec le tableau des utilisateurs, sans mot de passe).
 * @returns {Promise<void>}
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupère les détails d'un utilisateur à partir de son email.
 * Route : GET /users/:email
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.email : email de l'utilisateur).
 * @param {import('express').Response} res - Réponse Express (200 avec l'utilisateur, 404 s'il n'existe pas).
 * @returns {Promise<void>}
 */
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Crée un utilisateur. Le mot de passe est chiffré par le modèle avant l'enregistrement.
 * Route : POST /users
 * @async
 * @param {import('express').Request} req - Requête Express (req.body : username, email, password).
 * @param {import('express').Response} res - Réponse Express (201 avec le nom et l'email, 400 si les données sont invalides).
 * @returns {Promise<void>}
 */
exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      username: savedUser.username,
      email: savedUser.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Modifie le nom d'utilisateur et/ou le mot de passe d'un utilisateur.
 * L'email n'est pas modifiable.
 * Route : PUT /users/:email
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.email : email de l'utilisateur, req.body : username et/ou password).
 * @param {import('express').Response} res - Réponse Express (200 avec le nom et l'email, 400 ou 404 en cas d'erreur).
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.password) updates.password = req.body.password;

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Supprime un utilisateur.
 * Route : DELETE /users/:email
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.email : email de l'utilisateur).
 * @param {import('express').Response} res - Réponse Express (200 avec un message, 404 si l'utilisateur n'existe pas).
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};