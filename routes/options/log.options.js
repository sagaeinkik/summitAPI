'use strict';

const logController = require('../../controllers/log.controller');

//Allmänna loggar
module.exports.getLogsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        action: { type: 'string' },
                        table_name: { type: 'string' },
                        affected_id: { type: 'string' },
                        affected_data: {
                            type: 'object',
                            additionalProperties: true,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
    },
    handler: logController.getLogs,
};

//Loggar enligt handling
module.exports.getActionsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        action: { type: 'string' },
                        table_name: { type: 'string' },
                        affected_id: { type: 'string' },
                        affected_data: {
                            type: 'object',
                            additionalProperties: true,
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
    },
    handler: logController.getActionLogs,
};
