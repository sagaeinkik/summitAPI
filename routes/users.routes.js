'use strict';

//Importera routes från Options
const {
    getAllUsersOpts,
    getSingleUserOpts,
    addUserOpts,
    loginUserOpts,
    updateUserOpts,
    deleteUserOpts,
} = require('./options/users.options');

async function usersRoutes(fastify) {
    fastify.get('/users', getAllUsersOpts); //Alla användare
    fastify.get('/users/id=:id', getSingleUserOpts); //Enskild användare
    fastify.post('/signup', addUserOpts); //Lägg till
    fastify.post('/login', loginUserOpts); //Logga in
    fastify.put('/users/id=:id', updateUserOpts); //Uppdatera
    fastify.delete('/users/id=:id', deleteUserOpts); //Radera
}

module.exports = usersRoutes;
