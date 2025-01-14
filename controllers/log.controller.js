'use strict';

const logService = require('../services/log.service');
const errorHandler = require('../utils/errMsg');

//Error-objekt
let err = errorHandler.createError();

//Hämta senaste loggarna
module.exports.getLogs = async (request, reply) => {
    try {
        //Försök hämta loggar
        const logs = await logService.findLogs(request.server.mysql);

        if (logs.length === 0) {
            err = errorHandler.createError('Not found', 404, 'Inga loggar hittades');
            return reply.code(404).send(err);
        }

        //Returnera loggarna
        return reply.send(logs);
    } catch (error) {
        reply.code(500).send(error);
    }
};

//Hämta loggar enligt handling
module.exports.getActionLogs = async (request, reply) => {
    const action = request.params.action;
    try {
        const logs = await logService.findActions(request.server.mysql, action);

        //Kolla om något hittades
        if (logs.length === 0) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Inga loggar hittades',
                'insert, update, delete'
            );
            return reply.code(404).send(err);
        }

        //Returnera loggar
        return reply.send(logs);
    } catch (error) {
        reply.code(500).send(error);
    }
};
