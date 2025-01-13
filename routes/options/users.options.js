'use strict';
const userController = require('../../controllers/user.controller');

//Alla användare
module.exports.getAllUsersOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: userController.getAllUsers,
};

//Enskild användare
module.exports.getSingleUserOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    },
    handler: userController.getSingleUser,
};

//Lägg till användare
module.exports.addUserOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 30,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    },
    handler: userController.addUser,
};

//Logga in användare
module.exports.loginUserOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
            },
        },
    },
    handler: userController.loginUser,
};
