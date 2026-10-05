/**
 * @fileoverview Point d'entrée de l'application : configuration d'Express,
 * branchement des routes de l'API, des pages et de la documentation Swagger.
 */

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const verifyToken = require('./middlewares/auth');
const catwayRoutes = require('./routes/catwayRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');
const viewController = require('./controllers/viewController');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/catways', verifyToken, catwayRoutes);
app.use('/users', verifyToken, userRoutes);
app.use('/', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', verifyToken, authController.dashboard);
app.get('/catways-view', verifyToken, viewController.catwaysPage);
app.get('/catways-view/:id', verifyToken, viewController.catwayDetailPage);
app.get('/reservations-view', verifyToken, viewController.reservationsPage);
app.get('/users-view', verifyToken, viewController.usersPage);
app.get('/users-view/:email', verifyToken, viewController.userDetailPage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});