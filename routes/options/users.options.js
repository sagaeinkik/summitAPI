'use strict';
const userController = require('../../controllers/user.controller');
const pwHandler = require('../../utils/passwordHandler');

//Alla användare
module.exports.getAllUsersOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
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
                    id: { type: 'integer' },
                    username: { type: 'string' },
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
                    maxLength: 255,
                },
                password: {
                    type: 'string',
                    minLength: 5,
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    newUser: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            username: { type: 'string' },
                        },
                    },
                    token: { type: 'string' },
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
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    loggedInUser: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            username: { type: 'string' },
                        },
                    },
                    token: { type: 'string' },
                },
            },
        },
    },
    handler: userController.loginUser,
};

//Uppdatera användare
module.exports.updateUserOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 255,
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
                    message: { type: 'string' },
                    updatedUser: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            username: { type: 'string' },
                            token: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    handler: userController.updateUser,
};

//Radera användare
module.exports.deleteUserOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedUser: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            username: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    handler: userController.deleteUser,
};
