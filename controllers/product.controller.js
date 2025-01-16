'use strict';

const errorHandler = require('../utils/errMsg');
const productService = require('../services/product.service');

//Error-objekt
let err = errorHandler.createError();

//Hämta alla produkter
module.exports.getAllProducts = async (request, reply) => {
    //Nollställ error
    errorHandler.resetErrors(err);

    try {
        const products = await productService.findAllProducts(request.server.mysql);

        //Kontrollera längd
        if (products.length === 0) {
            err = errorHandler.createError('Not found', 404, 'Inga produkter hittades');
            return reply.code(404).send(err);
        }

        //Returnera hela listan med produkter
        return reply.send(products);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Alla produkter i angiven kategori
module.exports.getProdsByCat = async (request, reply) => {
    //Nolla
    errorHandler.resetErrors(err);

    //Hämta kategori
    const categoryName = request.params.category;

    try {
        const products = await productService.findProdByCatName(request.server.mysql, categoryName);

        //Kontrollera längd
        if (products.length === 0) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Inga produkter hittades enligt sökkriterierna'
            );
            return reply.code(404).send(err);
        }

        //Returnera produkterna i kategorin
        return reply.send(products);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Alla produkter av angiven leverantör
module.exports.getProdsBySupplier = async (request, reply) => {
    errorHandler.resetErrors(err);

    //Hämta leverantör
    let supplierName = request.params.supplier;

    try {
        const products = await productService.findProdBySupplierName(
            request.server.mysql,
            supplierName
        );

        if (products.length === 0) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Inga produkter hittades enligt sökkriterierna'
            );
            return reply.code(404).send(err);
        }

        //Returnera produkterna
        return reply.send(products);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Produkt baserat på ID
module.exports.getProdById = async (request, reply) => {
    errorHandler.resetErrors(err);

    const productId = request.params.id;

    try {
        const product = await productService.findProdById(request.server.mysql, productId);

        if (!product) {
            err = errorHandler.createError('Not found', 404, 'Ingen produkt hittades');
            return reply.code(404).send(err);
        }

        //Returnera produkt
        return reply.send(product);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Lägg till produkt
module.exports.addNewProduct = async (request, reply) => {
    errorHandler.resetErrors(err);

    //Hämta alla params
    let { productId, productName, size, extra, amount, inPrice, outPrice, categoryId, supplierId } =
        request.body;

    //Validera
    const validationResults = [
        errorHandler.checkEmpty(productId, 'productId'),
        errorHandler.checkEmpty(productName, 'productName'),
        errorHandler.checkEmpty(amount, 'amount'),
        errorHandler.checkEmpty(inPrice, 'inPrice'),
        errorHandler.checkEmpty(outPrice, 'outPrice'),
        errorHandler.checkEmpty(categoryId, 'categoryId'),
        errorHandler.checkEmpty(supplierId, 'supplierId'),
    ];

    const validationError = errorHandler.validateFields(reply, validationResults);
    if (validationError) {
        return validationError;
    }

    try {
        //Lägg till
        const addedProduct = await productService.insertProduct(
            request.server.mysql,
            productId,
            productName,
            size,
            extra,
            amount,
            inPrice,
            outPrice,
            categoryId,
            supplierId
        );

        return reply.send({ message: 'Produkt tillagd!', addedProduct });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Ändra befintlig produkt
module.exports.changeProduct = async (request, reply) => {
    errorHandler.resetErrors(err);

    const productId = request.params.id;

    const { productName, size, extra, amount, inPrice, outPrice, categoryId, supplierId } =
        request.body;

    //Validering
    const validationResults = [
        errorHandler.checkEmpty(productId, 'productId'),
        errorHandler.checkEmpty(productName, 'productName'),
        errorHandler.checkEmpty(amount, 'amount'),
        errorHandler.checkEmpty(inPrice, 'inPrice'),
        errorHandler.checkEmpty(outPrice, 'outPrice'),
        errorHandler.checkEmpty(categoryId, 'categoryId'),
        errorHandler.checkEmpty(supplierId, 'supplierId'),
    ];

    const validError = errorHandler.validateFields(reply, validationResults);
    if (validError) {
        return validError;
    }

    try {
        //Hämta rad att uppdatera
        const prodToUpdate = await productService.findProdById(request.server.mysql, productId);
        if (!prodToUpdate) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Hittade ingen produkt enligt kriterierna'
            );
            return reply.code(404).send(err);
        }

        //Uppdatera
        const updatedProduct = await productService.updateProduct(
            request.server.mysql,
            productId,
            productName,
            size,
            extra,
            amount,
            inPrice,
            outPrice,
            categoryId,
            supplierId,
            productId
        );

        return reply.send({ message: 'Produkt ändrad!', updatedProduct });
    } catch (error) {
        reply.code(500).send(error);
    }
};

//Radera produkt
module.exports.removeProduct = async (request, reply) => {
    errorHandler.resetErrors(err);
    const productId = request.params.id;

    try {
        //Kolla om produkt hittas
        const deletedProduct = await productService.findProdById(request.server.mysql, productId);
        if (!deletedProduct) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Ingen produkt hittades enligt sökkriterierna'
            );
            return reply.code(404).send(err);
        }

        //Radera
        const deleted = await productService.deleteProduct(request.server.mysql, productId);

        //Returnera raderade produkten
        return reply.send({ message: 'Produkt borttagen', deletedProduct });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Radera alla produkter i kategori
module.exports.removeProductsInCategory = async (request, reply) => {
    errorHandler.resetErrors(err);
    const catId = request.params.id;

    try {
        //Hämta alla produkter i kategori
        const deletedProducts = await productService.findProdsByCatId(request.server.mysql, catId);

        if (deletedProducts.length === 0) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Inga produkter hittades enligt sökkriterierna'
            );
            return reply.code(404).send(err);
        }

        const deleted = await productService.deleteCatProds(request.server.mysql, catId);

        return reply.send({
            message: 'Samtliga produkter inom kategorin raderade!',
            deletedProducts,
        });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Radera alla produkter av leverantör
module.exports.removeProdsBySupplier = async (request, reply) => {
    errorHandler.resetErrors(err);
    const suppId = request.params.id;

    try {
        //Hämta alla produkter i kategori
        const deletedProducts = await productService.findProdsBySuppId(
            request.server.mysql,
            suppId
        );

        if (deletedProducts.length === 0) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Inga produkter hittades enligt sökkriterierna'
            );
            return reply.code(404).send(err);
        }

        const deleted = await productService.deleteSuppProds(request.server.mysql, suppId);

        return reply.send({
            message: 'Samtliga produkter inom kategorin raderade!',
            deletedProducts,
        });
    } catch (error) {
        return reply.code(500).send(error);
    }
};
