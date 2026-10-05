/**
 * @fileoverview Connexion à la base de données MongoDB.
 * @module config/db
 */
const mongoose = require('mongoose');

/**
 * Se connecte à MongoDB avec l'URI définie dans la variable d'environnement MONGO_URI.
 * Arrête l'application si la connexion échoue.
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;