'use strict';

//Importera routes från Options
const {
    getAllUsersOpts,
    getSingleUserOpts,
    addUserOpts,
    loginUserOpts,
} = require('./options/users.options');

async function usersRoutes(fastify) {
    fastify.get('/users', getAllUsersOpts); //Alla användare
    fastify.get('/users/id/:id', getSingleUserOpts); //Enskild användare
    fastify.post('/signup', addUserOpts); //Lägg till användare
    fastify.post('/login', loginUserOpts); //Logga in
}

module.exports = usersRoutes;
