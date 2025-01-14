'use strict';

const categoryController = require('../../controllers/category.controller');
const pwHandler = require('../../utils/passwordHandler');

//Alla kategorier
module.exports.getAllCatsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        category_name: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: categoryController.getAllCategories,
};

//Specifik kategori
module.exports.getCategoryOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    category_name: { type: 'string' },
                },
            },
        },
    },
    handler: categoryController.getCatById,
};

//Lägg till kategori
module.exports.addCatOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['category_name'],
            properties: {
                category_name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    addedCategory: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            category_name: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: categoryController.addCategory,
};

//Uppdatera kategori
module.exports.updateCatOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['category_name'],
            properties: {
                category_name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    updatedCategory: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            category_name: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: categoryController.updateCategory,
};

//Radera kategori
module.exports.deleteCatOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedCategory: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            category_name: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: categoryController.deleteCategory,
};
