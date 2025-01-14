'use strict';

const { getLogsOpts, getActionsOpts } = require('./options/log.options');

async function logRoutes(fastify) {
    fastify.get('/logs', getLogsOpts); //15 senaste loggarna
    fastify.get('/logs/:action', getActionsOpts); //15 senaste loggarna av angiven handling
}

module.exports = logRoutes;
