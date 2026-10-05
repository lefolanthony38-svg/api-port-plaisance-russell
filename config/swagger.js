/**
 * @fileoverview Description OpenAPI de l'API (utilisée par Swagger UI sur /api-docs).
 * @module config/swagger
 */

// Fonctions utilitaires pour éviter de répéter les mêmes blocs
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const jsonContent = (schema) => ({ 'application/json': { schema } });

const unauthorized = { $ref: '#/components/responses/Unauthorized' };
const notFound = { $ref: '#/components/responses/NotFound' };
const badRequest = { $ref: '#/components/responses/BadRequest' };

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', example: 'capitaine@russell.fr' },
    password: { type: 'string', format: 'password' },
  },
};

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API du port de plaisance Russell',
    version: '1.0.0',
    description:
      "API privée de gestion des catways, des réservations et des utilisateurs de la capitainerie. Toutes les routes, sauf la connexion et la déconnexion, nécessitent d'être connecté : la connexion dépose un cookie « token » valable 2 heures.",
  },
  servers: [{ url: '/', description: 'Serveur courant' }],
  security: [{ cookieAuth: [] }],
  tags: [
    { name: 'Authentification' },
    { name: 'Catways' },
    { name: 'Réservations' },
    { name: 'Utilisateurs' },
  ],

  paths: {
    // ---------- Authentification ----------
    '/login': {
      post: {
        tags: ['Authentification'],
        summary: 'Se connecter',
        description:
          "Vérifie l'email et le mot de passe, puis dépose le cookie « token ». En cas de succès, redirige vers /dashboard. En cas d'échec, la page d'accueil est réaffichée avec un message d'erreur.",
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': { schema: loginSchema },
            'application/json': { schema: loginSchema },
          },
        },
        responses: {
          302: { description: 'Connexion réussie : redirection vers /dashboard' },
          200: { description: "Identifiants incorrects : page d'accueil réaffichée (HTML)" },
        },
      },
    },
    '/logout': {
      get: {
        tags: ['Authentification'],
        summary: 'Se déconnecter',
        description: "Supprime le cookie « token » et redirige vers la page d'accueil.",
        security: [],
        responses: {
          302: { description: "Déconnexion réussie : redirection vers la page d'accueil" },
        },
      },
    },

    // ---------- Catways ----------
    '/catways': {
      get: {
        tags: ['Catways'],
        summary: 'Lister tous les catways',
        responses: {
          200: {
            description: 'Liste des catways',
            content: jsonContent({ type: 'array', items: ref('Catway') }),
          },
          401: unauthorized,
        },
      },
      post: {
        tags: ['Catways'],
        summary: 'Créer un catway',
        requestBody: { required: true, content: jsonContent(ref('CatwayInput')) },
        responses: {
          201: { description: 'Catway créé', content: jsonContent(ref('Catway')) },
          400: badRequest,
          401: unauthorized,
        },
      },
    },
    '/catways/{id}': {
      parameters: [{ $ref: '#/components/parameters/CatwayId' }],
      get: {
        tags: ['Catways'],
        summary: "Récupérer les détails d'un catway",
        responses: {
          200: { description: 'Détails du catway', content: jsonContent(ref('Catway')) },
          401: unauthorized,
          404: notFound,
        },
      },
      put: {
        tags: ['Catways'],
        summary: "Modifier l'état d'un catway",
        description:
          "Seul l'état (catwayState) est modifiable : le numéro et le type ne peuvent pas être changés.",
        requestBody: { required: true, content: jsonContent(ref('CatwayStateInput')) },
        responses: {
          200: { description: 'Catway modifié', content: jsonContent(ref('Catway')) },
          400: badRequest,
          401: unauthorized,
          404: notFound,
        },
      },
      delete: {
        tags: ['Catways'],
        summary: 'Supprimer un catway',
        responses: {
          200: { description: 'Catway supprimé', content: jsonContent(ref('Message')) },
          401: unauthorized,
          404: notFound,
        },
      },
    },

    // ---------- Réservations ----------
    '/catways/{id}/reservations': {
      parameters: [{ $ref: '#/components/parameters/CatwayId' }],
      get: {
        tags: ['Réservations'],
        summary: "Lister les réservations d'un catway",
        responses: {
          200: {
            description: 'Liste des réservations du catway',
            content: jsonContent({ type: 'array', items: ref('Reservation') }),
          },
          401: unauthorized,
        },
      },
      post: {
        tags: ['Réservations'],
        summary: 'Créer une réservation pour un catway',
        requestBody: { required: true, content: jsonContent(ref('ReservationInput')) },
        responses: {
          201: { description: 'Réservation créée', content: jsonContent(ref('Reservation')) },
          400: badRequest,
          401: unauthorized,
          404: { description: "Le catway n'existe pas", content: jsonContent(ref('Message')) },
        },
      },
    },
    '/catways/{id}/reservations/{idReservation}': {
      parameters: [
        { $ref: '#/components/parameters/CatwayId' },
        { $ref: '#/components/parameters/ReservationId' },
      ],
      get: {
        tags: ['Réservations'],
        summary: "Récupérer les détails d'une réservation",
        responses: {
          200: { description: 'Détails de la réservation', content: jsonContent(ref('Reservation')) },
          401: unauthorized,
          404: notFound,
        },
      },
      put: {
        tags: ['Réservations'],
        summary: 'Modifier une réservation',
        requestBody: { required: true, content: jsonContent(ref('ReservationInput')) },
        responses: {
          200: { description: 'Réservation modifiée', content: jsonContent(ref('Reservation')) },
          400: badRequest,
          401: unauthorized,
          404: notFound,
        },
      },
      delete: {
        tags: ['Réservations'],
        summary: 'Supprimer une réservation',
        responses: {
          200: { description: 'Réservation supprimée', content: jsonContent(ref('Message')) },
          401: unauthorized,
          404: notFound,
        },
      },
    },

    // ---------- Utilisateurs ----------
    '/users': {
      get: {
        tags: ['Utilisateurs'],
        summary: 'Lister tous les utilisateurs',
        description: 'Le mot de passe n\'est jamais renvoyé.',
        responses: {
          200: {
            description: 'Liste des utilisateurs',
            content: jsonContent({ type: 'array', items: ref('User') }),
          },
          401: unauthorized,
        },
      },
      post: {
        tags: ['Utilisateurs'],
        summary: 'Créer un utilisateur',
        description:
          "L'email doit être unique et le mot de passe contenir au moins 8 caractères. Le mot de passe est chiffré avant d'être enregistré.",
        requestBody: { required: true, content: jsonContent(ref('UserInput')) },
        responses: {
          201: { description: 'Utilisateur créé', content: jsonContent(ref('User')) },
          400: badRequest,
          401: unauthorized,
        },
      },
    },
    '/users/{email}': {
      parameters: [{ $ref: '#/components/parameters/Email' }],
      get: {
        tags: ['Utilisateurs'],
        summary: "Récupérer les détails d'un utilisateur",
        responses: {
          200: { description: "Détails de l'utilisateur", content: jsonContent(ref('User')) },
          401: unauthorized,
          404: notFound,
        },
      },
      put: {
        tags: ['Utilisateurs'],
        summary: "Modifier un utilisateur",
        description:
          "Le nom d'utilisateur et/ou le mot de passe peuvent être modifiés. L'email ne peut pas l'être.",
        requestBody: { required: true, content: jsonContent(ref('UserUpdate')) },
        responses: {
          200: { description: 'Utilisateur modifié', content: jsonContent(ref('User')) },
          400: badRequest,
          401: unauthorized,
          404: notFound,
        },
      },
      delete: {
        tags: ['Utilisateurs'],
        summary: 'Supprimer un utilisateur',
        responses: {
          200: { description: 'Utilisateur supprimé', content: jsonContent(ref('Message')) },
          401: unauthorized,
          404: notFound,
        },
      },
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' },
    },
    parameters: {
      CatwayId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Numéro du catway',
        schema: { type: 'integer', example: 1 },
      },
      ReservationId: {
        name: 'idReservation',
        in: 'path',
        required: true,
        description: 'Identifiant de la réservation',
        schema: { type: 'string' },
      },
      Email: {
        name: 'email',
        in: 'path',
        required: true,
        description: "Adresse email de l'utilisateur",
        schema: { type: 'string', format: 'email' },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Non connecté, ou token invalide ou expiré',
        content: jsonContent(ref('Message')),
      },
      NotFound: {
        description: 'Ressource non trouvée',
        content: jsonContent(ref('Message')),
      },
      BadRequest: {
        description: 'Données invalides ou manquantes',
        content: jsonContent(ref('Message')),
      },
    },
    schemas: {
      Message: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      Catway: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          catwayNumber: { type: 'integer', example: 1 },
          catwayType: { type: 'string', enum: ['long', 'short'] },
          catwayState: { type: 'string', example: 'bon état' },
        },
      },
      CatwayInput: {
        type: 'object',
        required: ['catwayNumber', 'catwayType', 'catwayState'],
        properties: {
          catwayNumber: { type: 'integer', example: 25 },
          catwayType: { type: 'string', enum: ['long', 'short'] },
          catwayState: { type: 'string', example: 'bon état' },
        },
      },
      CatwayStateInput: {
        type: 'object',
        required: ['catwayState'],
        properties: { catwayState: { type: 'string', example: 'à réparer' } },
      },
      Reservation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          catwayNumber: { type: 'integer', example: 1 },
          clientName: { type: 'string', example: 'Jean Dupont' },
          boatName: { type: 'string', example: 'Le Nautilus' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
      ReservationInput: {
        type: 'object',
        required: ['clientName', 'boatName', 'startDate', 'endDate'],
        properties: {
          clientName: { type: 'string', example: 'Jean Dupont' },
          boatName: { type: 'string', example: 'Le Nautilus' },
          startDate: { type: 'string', format: 'date', example: '2026-08-01' },
          endDate: { type: 'string', format: 'date', example: '2026-08-10' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string', example: 'Anthony' },
          email: { type: 'string', format: 'email', example: 'capitaine@russell.fr' },
        },
      },
      UserInput: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'Anthony' },
          email: { type: 'string', format: 'email', example: 'capitaine@russell.fr' },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      UserUpdate: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'Nouveau nom' },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
      },
    },
  },
};
// ---------- Compléments : règles de gestion ----------
swaggerSpec.components.responses.Forbidden = {
  description: 'Action interdite',
  content: jsonContent(ref('Message')),
};

const usersByEmail = swaggerSpec.paths['/users/{email}'];
usersByEmail.put.description =
  "Le nom d'utilisateur et/ou le mot de passe peuvent être modifiés. L'email ne peut pas l'être. Le compte administrateur ne peut être modifié que par lui-même (403 sinon).";
usersByEmail.put.responses[403] = { $ref: '#/components/responses/Forbidden' };
usersByEmail.delete.description =
  'Le compte administrateur ne peut pas être supprimé (403).';
usersByEmail.delete.responses[403] = { $ref: '#/components/responses/Forbidden' };

swaggerSpec.paths['/catways/{id}/reservations'].post.description =
  "La date de fin ne peut pas être antérieure à la date de début, et la période ne doit pas chevaucher une autre réservation du même catway (400 sinon).";
swaggerSpec.paths['/catways/{id}/reservations/{idReservation}'].put.description =
  "Mêmes règles qu'à la création : dates cohérentes et pas de chevauchement avec une autre réservation du même catway (400 sinon).";
  
module.exports = swaggerSpec;