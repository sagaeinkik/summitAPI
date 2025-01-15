'use strict';

const {
    getAllSuppliersOpts,
    getSupplierByIdOpts,
    addSupplierOpts,
    updateSupplierOpts,
    deleteSupplierOpts,
} = require('./options/suppliers.options');

async function suppliersRoutes(fastify) {
    fastify.get('/suppliers', getAllSuppliersOpts); //Alla leverantörer
    fastify.get('/suppliers/id=:id', getSupplierByIdOpts); //Specifik leverantör
    fastify.post('/suppliers', addSupplierOpts); //Lägg till
    fastify.put('/suppliers/id=:id', updateSupplierOpts); //Uppdatera
    fastify.delete('/suppliers/id=:id', deleteSupplierOpts); //Radera
}

module.exports = suppliersRoutes;
