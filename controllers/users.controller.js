const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Models
const { User } = require('../models/user.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    //Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ 
        name,
        email, 
        password: hashPassword,
    });

    //Remove password from response
    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser
    });   
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate credentials (email)
    const user = await User.findOne({ where: { email, status: 'active' } });

    if(!user){
        return next(new AppError('Credentials invalid', 400));
    }

    //Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword){
        return next(new AppError('Credentials invalid', 400));
    }

    //Generate JWT (Jason Web Token)
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { 
        expiresIn: '5d',
     });

    //Send response
    res.status(200).json({
        status: 'success',
        token
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { name, email } = req.body;

    const updatedUser = await user.update({ name, email });

    res.status(204).json({ 
        status: 'success',
        updatedUser
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: 'deleted'});

    res.status(204).json({ status: 'success' });
});

const getAllActiveUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({ where: { status: 'active' } });

    res.status(200).json({
        status: 'success',
        users
    });    
});

module.exports = { 
    createUser,
    login,
    updateUser, 
    deleteUser,
    getAllActiveUsers
};