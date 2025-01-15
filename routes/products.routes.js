'use strict';

const {
    getAllProdsOpts,
    getProdsByCatOpts,
    getProdsBySuppOpts,
    getProdByIdOpts,
    addProdOpts,
    updateProdOpts,
    deleteProdOpts,
    deleteProdsInCatOpts,
    deleteProdsbySuppOpts,
} = require('./options/products.options');

async function productRoutes(fastify) {
    fastify.get('/products', getAllProdsOpts); //Alla
    fastify.get('/products/category=:category', getProdsByCatOpts); //Alla i kategori
    fastify.get('/products/supplier=:supplier', getProdsBySuppOpts); //Alla från leverantör
    fastify.get('/products/id=:id', getProdByIdOpts); //En produkt
    fastify.post('/products', addProdOpts); //Lägg till
    fastify.put('/products/id=:id', updateProdOpts); //Uppdatera
    fastify.delete('/products/id=:id', deleteProdOpts); //Radera enskild
    fastify.delete('/products/category=:id', deleteProdsInCatOpts); //Radera alla i kategori
    fastify.delete('/products/supplier=:id', deleteProdsbySuppOpts); //Radera alla av leverantör
}

module.exports = productRoutes;
