'use strict';

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
    fastify.get('/categories/id=:id', getCategoryOpts); //Specifik kategori
    fastify.post('/categories', addCatOpts); //Lägg till kategori
    fastify.put('/categories/id=:id', updateCatOpts); //Ändra kategori
    fastify.delete('/categories/id=:id', deleteCatOpts); //Ta bort kategori
}

module.exports = categoriesRoutes;
