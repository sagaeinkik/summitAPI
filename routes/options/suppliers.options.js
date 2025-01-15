'use strict';

const supplierController = require('../../controllers/supplier.controller');
const pwHandler = require('../../utils/passwordHandler');

//Alla leverantörer
module.exports.getAllSuppliersOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        company_name: { type: 'string' },
                        street_address: { type: 'string' },
                        area: { type: 'string' },
                        telephone: { type: 'string' },
                        email: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: supplierController.getAllSuppliers,
};

//Specifik leverantör
module.exports.getSupplierByIdOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    company_name: { type: 'string' },
                    street_address: { type: 'string' },
                    area: { type: 'string' },
                    telephone: { type: 'string' },
                    email: { type: 'string' },
                },
            },
        },
    },
    handler: supplierController.getSupplierById,
};

//Lägg till leverantör
module.exports.addSupplierOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['companyName', 'telephone', 'email'],
            properties: {
                companyName: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
                streetAddress: { type: 'string' },
                area: { type: 'string' },
                telephone: {
                    type: 'string',
                    minLength: 5,
                    pattern: '^[0-9+\\-]+$',
                },
                email: {
                    type: 'string',
                    minLength: 5,
                    format: 'email',
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    addedCompany: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            company_name: { type: 'string' },
                            street_address: { type: 'string' },
                            area: { type: 'string' },
                            telephone: { type: 'string' },
                            email: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: supplierController.addSupplier,
};

//Uppdatera
module.exports.updateSupplierOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['companyName', 'telephone', 'email'],
            properties: {
                companyName: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
                streetAddress: { type: 'string' },
                area: { type: 'string' },
                telephone: {
                    type: 'string',
                    minLength: 5,
                    pattern: '^[0-9+\\-]+$',
                },
                email: {
                    type: 'string',
                    minLength: 5,
                    format: 'email',
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    updatedSupplier: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            company_name: { type: 'string' },
                            street_address: { type: 'string' },
                            area: { type: 'string' },
                            telephone: { type: 'string' },
                            email: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: supplierController.updateSupplier,
};

//Radera
module.exports.deleteSupplierOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedSupplier: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            company_name: { type: 'string' },
                            street_address: { type: 'string' },
                            area: { type: 'string' },
                            telephone: { type: 'string' },
                            email: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: supplierController.deleteSupplier,
};
