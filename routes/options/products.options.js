'use strict';

const productController = require('../../controllers/product.controller');
const pwHandler = require('../../utils/passwordHandler');

//Alla produkter
module.exports.getAllProdsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        product_id: { type: 'string' },
                        product_name: { type: 'string' },
                        size: { type: 'string' },
                        extra: { type: 'string' },
                        amount: { type: 'integer' },
                        in_price: { type: 'integer' },
                        out_price: { type: 'integer' },
                        category_name: { type: 'string' },
                        supplier_name: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: productController.getAllProducts,
};

//Produkter i kategori
module.exports.getProdsByCatOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        product_id: { type: 'string' },
                        product_name: { type: 'string' },
                        size: { type: 'string' },
                        extra: { type: 'string' },
                        amount: { type: 'integer' },
                        in_price: { type: 'integer' },
                        out_price: { type: 'integer' },
                        category_name: { type: 'string' },
                        supplier_name: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: productController.getProdsByCat,
};

//Produkter från leverantör
module.exports.getProdsBySuppOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        product_id: { type: 'string' },
                        product_name: { type: 'string' },
                        size: { type: 'string' },
                        extra: { type: 'string' },
                        amount: { type: 'integer' },
                        in_price: { type: 'integer' },
                        out_price: { type: 'integer' },
                        category_name: { type: 'string' },
                        supplier_name: { type: 'string' },
                    },
                },
            },
        },
    },
    handler: productController.getProdsBySupplier,
};

//Produkt enligt ID
module.exports.getProdByIdOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    product_id: { type: 'string' },
                    product_name: { type: 'string' },
                    size: { type: 'string' },
                    extra: { type: 'string' },
                    amount: { type: 'integer' },
                    in_price: { type: 'integer' },
                    out_price: { type: 'integer' },
                    category_name: { type: 'string' },
                    supplier_name: { type: 'string' },
                },
            },
        },
    },
    handler: productController.getProdById,
};

//Lägg till
module.exports.addProdOpts = {
    schema: {
        body: {
            type: 'object',
            required: [
                'productId',
                'productName',
                'amount',
                'inPrice',
                'outPrice',
                'categoryId',
                'supplierId',
            ],
            properties: {
                productId: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 30,
                    pattern: '^[0-9]+$',
                },
                productName: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
                size: { type: 'string' },
                extra: { type: 'string' },
                amount: { type: 'integer' },
                inPrice: { type: 'integer' },
                outPrice: { type: 'integer' },
                categoryId: { type: 'integer' },
                supplierId: { type: 'integer' },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    addedProduct: {
                        type: 'object',
                        properties: {
                            product_id: { type: 'string' },
                            product_name: { type: 'string' },
                            size: { type: 'string' },
                            extra: { type: 'string' },
                            amount: { type: 'integer' },
                            in_price: { type: 'integer' },
                            out_price: { type: 'integer' },
                            category_id: { type: 'integer' },
                            supplier_id: { type: 'integer' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: productController.addNewProduct,
};

//Uppdatera
module.exports.updateProdOpts = {
    schema: {
        body: {
            type: 'object',
            required: [
                'productId',
                'productName',
                'amount',
                'inPrice',
                'outPrice',
                'categoryId',
                'supplierId',
            ],
            properties: {
                productId: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 30,
                    pattern: '^[0-9]+$',
                },
                productName: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 255,
                },
                size: { type: 'string' },
                extra: { type: 'string' },
                amount: { type: 'integer' },
                inPrice: { type: 'integer' },
                outPrice: { type: 'integer' },
                categoryId: { type: 'integer' },
                supplierId: { type: 'integer' },
            },
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    updatedProduct: {
                        type: 'object',
                        properties: {
                            product_id: { type: 'string' },
                            product_name: { type: 'string' },
                            size: { type: 'string' },
                            extra: { type: 'string' },
                            in_price: { type: 'integer' },
                            out_price: { type: 'integer' },
                            category_id: { type: 'integer' },
                            supplier_id: { type: 'integer' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: productController.changeProduct,
};

//Radera enskild
module.exports.deleteProdOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedProduct: {
                        type: 'object',
                        properties: {
                            product_id: { type: 'string' },
                            product_name: { type: 'string' },
                            size: { type: 'string' },
                            extra: { type: 'string' },
                            in_price: { type: 'integer' },
                            out_price: { type: 'integer' },
                            category_id: { type: 'integer' },
                            supplier_id: { type: 'integer' },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: productController.removeProduct,
};

//Radera samtliga inom kategori
module.exports.deleteProdsInCatOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedProducts: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                product_id: { type: 'string' },
                                product_name: { type: 'string' },
                                size: { type: 'string' },
                                extra: { type: 'string' },
                                in_price: { type: 'integer' },
                                out_price: { type: 'integer' },
                                category_id: { type: 'integer' },
                                supplier_id: { type: 'integer' },
                            },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: productController.removeProductsInCategory,
};

//Radera samtliga av leverantör
module.exports.deleteProdsbySuppOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    deletedProducts: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                product_id: { type: 'string' },
                                product_name: { type: 'string' },
                                size: { type: 'string' },
                                extra: { type: 'string' },
                                in_price: { type: 'integer' },
                                out_price: { type: 'integer' },
                                category_id: { type: 'integer' },
                                supplier_id: { type: 'integer' },
                            },
                        },
                    },
                },
            },
        },
    },
    preHandler: pwHandler.authenticateToken,
    handler: productController.removeProdsBySupplier,
};
