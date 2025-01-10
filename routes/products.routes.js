'use strict';

async function productRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' };
    });
}

module.exports = productRoutes;
