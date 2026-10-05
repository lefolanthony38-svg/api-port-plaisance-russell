/**
 * @fileoverview Middleware d'authentification par token JWT.
 * @module middlewares/auth
 */
const jwt = require('jsonwebtoken');

/**
 * Vérifie que la requête contient un cookie « token » valide.
 * Si c'est le cas, les informations de l'utilisateur sont placées dans req.user
 * et la requête continue. Sinon, répond avec le code 401.
 * @param {import('express').Request} req - Requête Express.
 * @param {import('express').Response} res - Réponse Express.
 * @param {import('express').NextFunction} next - Passe au traitement suivant.
 * @returns {void}
 */
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, veuillez vous connecter' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = verifyToken;