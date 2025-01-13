'use strict';
const userController = require('../../controllers/user.controller');

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
