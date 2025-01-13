'use strict';
const userService = require('../services/userService');

//Hämta alla användare
exports.getAllUsers = async (request, reply) => {
    try {
        //Leta upp användare
        const users = await userService.findAll(request.server.mysql);

        if (users.length === 0) {
            return reply.send('Hittade inga användare').code(404);
        } else {
            return reply.status(200).send(users);
        }
    } catch (error) {
        return reply.send(error).code(500);
    }
};
