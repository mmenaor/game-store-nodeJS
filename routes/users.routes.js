const express = require('express');

// Controllers
const {  
    createUser, 
    login,
    updateUser, 
    deleteUser, 
    getAllActiveUsers 
} = require('../controllers/users.controller');

//Middlewares
const { createUserValidators } = require('../middlewares/validators.middleware');
const { userExists } = require('../middlewares/users.middleware');
const { protectSession, protectUserAccount } = require('../middlewares/auth.middleware');

// Define endpoints before activate server listening to requests
const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/', getAllActiveUsers);

usersRouter
    .use('/:id', userExists)
    .route('/:id')
    .patch(protectUserAccount, updateUser)
    .delete(protectUserAccount, deleteUser);

// module is a nodeJS global object
module.exports = { usersRouter };