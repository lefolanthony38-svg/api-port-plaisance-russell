/**
 * @fileoverview Contrôleur de l'API REST des catways (opérations CRUD).
 * @module controllers/catwayController
 */
const Catway = require('../models/Catway');

/**
 * Liste tous les catways.
 * Route : GET /catways
 * @async
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express (200 avec le tableau des catways).
 * @returns {Promise<void>}
 */
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupère les détails d'un catway à partir de son numéro.
 * Route : GET /catways/:id
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway).
 * @param {import('express').Response} res - Réponse Express (200 avec le catway, 404 s'il n'existe pas).
 * @returns {Promise<void>}
 */
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Crée un catway.
 * Route : POST /catways
 * @async
 * @param {import('express').Request} req - Requête Express (req.body : catwayNumber, catwayType, catwayState).
 * @param {import('express').Response} res - Réponse Express (201 avec le catway créé, 400 si les données sont invalides).
 * @returns {Promise<void>}
 */
exports.createCatway = async (req, res) => {
  try {
    const newCatway = new Catway({
      catwayNumber: req.body.catwayNumber,
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState,
    });
    const savedCatway = await newCatway.save();
    res.status(201).json(savedCatway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Modifie l'état d'un catway. Le numéro et le type ne sont pas modifiables.
 * Route : PUT /catways/:id
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway, req.body.catwayState : nouvel état).
 * @param {import('express').Response} res - Réponse Express (200 avec le catway modifié, 400 ou 404 en cas d'erreur).
 * @returns {Promise<void>}
 */
exports.updateCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true, runValidators: true }
    );
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }
    res.status(200).json(catway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Supprime un catway.
 * Route : DELETE /catways/:id
 * @async
 * @param {import('express').Request} req - Requête Express (req.params.id : numéro du catway).
 * @param {import('express').Response} res - Réponse Express (200 avec un message, 404 si le catway n'existe pas).
 * @returns {Promise<void>}
 */
exports.deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    if (!catway) {
      return res.status(404).json({ message: 'Catway non trouvé' });
    }
    res.status(200).json({ message: 'Catway supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};