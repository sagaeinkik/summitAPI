'use strict';

async function summitRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        return {
            meddelande:
                'Hej! Detta är ett API gjort av Saga Einarsdotter Kikajon för kursen Fullstacksutveckling med Ramverk, Mittuniversitetet 2025. Det är gjort med Fastify som ramverk, mot en MySQL-databas.',
        };
    });
}

module.exports = summitRoutes;
