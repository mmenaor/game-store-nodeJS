const express = require('express');

// Controllers
const {  
    createConsole, 
    getAllConsoles,
    updateConsole, 
    deleteConsole
} = require('../controllers/consoles.controller');

//Middlewares
const { consoleExists } = require('../middlewares/consoles.middleware');
const { protectSession } = require('../middlewares/auth.middleware');

// Define endpoints before activate server listening to requests
const consolesRouter = express.Router();

consolesRouter.get('/', getAllConsoles);

consolesRouter.use(protectSession);

consolesRouter.post('/', createConsole);

consolesRouter
    .use('/:id', consoleExists)
    .route('/:id')
    .patch(updateConsole)
    .delete(deleteConsole);

// module is a nodeJS global object
module.exports = { consolesRouter };