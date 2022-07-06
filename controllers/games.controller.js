//Models
const { Game } = require('../models/game.model');
const { Console } = require('../models/console.model');
const { Review } = require('../models/review.model');
const { GameInConsole } = require('../models/gameInConsole.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createGame = catchAsync(async (req, res, next) => {
    const { title, genre } = req.body;

    const newGame = await Game.create({ 
        title,
        genre
    });

    res.status(201).json({
        status: 'success',
        newGame
    });   
});

const getAllGames = catchAsync(async (req, res, next) => {
    const games = await Game.findAll({
        include: [
            { model: Console }, 
            { model: Review }
        ]
    });

    res.status(200).json({
        status: 'success',
        games
    });
});

const updateGame = catchAsync(async (req, res, next) => {
    const { game } = req;
    const { title } = req.body;

    await game.update({ title });

    res.status(204).json({ status: 'success' });
});

const deleteGame = catchAsync(async (req, res, next) => {
    const { game } = req;

    await game.update({ status: 'deleted'});

    res.status(204).json({ status: 'success' });
});

const writeReview = catchAsync(async (req, res, next) => {
    const { comment } = req.body;
    const { game, sessionUser } = req;

    const newReview = await Review.create({ 
        userId: sessionUser.id,
        gameId: game.id,
        comment
    });

    res.status(201).json({
        status: 'success',
        newReview
    }); 
});

const assignConsoleToGame = catchAsync(async (req, res, next) => {
    const { gameId, consoleId } = req.body;

    const gameInConsole = await GameInConsole.create({ 
        gameId, 
        consoleId 
    });

    res.status(200).json({
        status: 'success',
        gameInConsole
    });
});

module.exports = {
    createGame, 
    getAllGames,
    updateGame, 
    deleteGame, 
    writeReview,
    assignConsoleToGame
};