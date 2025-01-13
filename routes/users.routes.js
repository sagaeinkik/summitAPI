'use strict';

//Importera routes från Options
const { getAllUsersOpts } = require('./options/users.options');

async function usersRoutes(fastify) {
    fastify.get('/users', getAllUsersOpts);
}

module.exports = usersRoutes;
