'use strict';

const {
    getAllSuppliersOpts,
    getSupplierByIdOpts,
    addSupplierOpts,
} = require('./options/suppliers.options');

async function suppliersRoutes(fastify) {
    fastify.get('/suppliers', getAllSuppliersOpts); //Alla leverantörer
    fastify.get('/suppliers/:id', getSupplierByIdOpts); //Specifik leverantör
    fastify.post('/suppliers', addSupplierOpts); //Lägg till
}

module.exports = suppliersRoutes;
