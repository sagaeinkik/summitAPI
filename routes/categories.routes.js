'use strict';
const pwHandler = require('../utils/passwordHandler');

//Importera routes från Options
const {
    getAllCatsOpts,
    getCategoryOpts,
    addCatOpts,
    updateCatOpts,
    deleteCatOpts,
} = require('./options/categories.options');

async function categoriesRoutes(fastify) {
    fastify.get('/categories', getAllCatsOpts); //Alla kategorier
    fastify.get('/categories/:id', getCategoryOpts); //Specifik kategori
    fastify.post('/categories', addCatOpts); //Lägg till kategori
    fastify.put('/categories/:id', updateCatOpts); //Ändra kategori
    fastify.delete('/categories/:id', deleteCatOpts); //Ta bort kategori
}

module.exports = categoriesRoutes;
