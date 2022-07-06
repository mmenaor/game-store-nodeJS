const express = require('express');

// Controllers
const {  
    createGame, 
    getAllGames,
    updateGame, 
    deleteGame, 
    writeReview,
    assignConsoleToGame
} = require('../controllers/games.controller');

//Middlewares
const { gameExists } = require('../middlewares/games.middleware');
const { protectSession } = require('../middlewares/auth.middleware');

// Define endpoints before activate server listening to requests
const gamesRouter = express.Router();

gamesRouter.get('/', getAllGames);

gamesRouter.use(protectSession);

gamesRouter.post('/', createGame);

gamesRouter.post('/reviews/:gameId', gameExists, writeReview);

gamesRouter.post('/assign-console', assignConsoleToGame);

gamesRouter
    .use('/:id', gameExists)
    .route('/:id')
    .patch(updateGame)
    .delete(deleteGame);

// module is a nodeJS global object
module.exports = { gamesRouter };