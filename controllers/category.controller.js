'use strict';

const errorHandler = require('../utils/errMsg');
const pwHandler = require('../utils/passwordHandler');
const categoryService = require('../services/category.service');

//ERROR-OBJEKT
let err = errorHandler.createError();

//Hämta alla kategorier
module.exports.getAllCategories = async (request, reply) => {
    errorHandler.resetErrors(err);
    try {
        const categories = await categoryService.findAll(request.server.mysql);

        //Felmeddelande om kategori-array är tom
        if (categories.length === 0) {
            //Fyll på error-meddelandet
            err = errorHandler.createError('Not found', 404, 'Hittade inga kategorier');
            return reply.code(404).send(err);
        } else {
            //Returnera hela listan
            return reply.send(categories);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Hämta specifik kategori
module.exports.getCatById = async (request, reply) => {
    errorHandler.resetErrors(err);
    try {
        const category = await categoryService.findCatById(request.server.mysql, request.params.id);

        //Felmeddelande om kategori inte finns
        if (!category) {
            err = errorHandler.createError('Not found', 404, 'Hittade ingen kategori');
            return reply.code(404).send(err);
        } else {
            //Returnera kategorin
            return reply.send(category);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Lägg till kategori
module.exports.addCategory = async (request, reply) => {
    errorHandler.resetErrors(err);
    const catName = request.body.category_name;
    try {
        // Kontrollera att fält inte är tomt
        const stringCheck = errorHandler.checkEmpty(catName, 'Kategori');
        if (!stringCheck.valid) {
            //Skicka det error som skapas av checkEmpty-funktionen
            return reply.code(stringCheck.error.https_response.code).send(stringCheck.error);
        }

        //Kolla om kategori redan finns
        const existingCat = await categoryService.findCatByName(request.server.mysql, catName);

        if (existingCat) {
            err = errorHandler.createError('Conflict', 409, 'Kategori finns redan');
            return reply.code(409).send(err);
        }

        //Har vi kommit såhär långt kan vi lägga till
        const addedCategory = await categoryService.insertCategory(request.server.mysql, catName);
        return reply.code(201).send({ message: 'Kategori tillagd', addedCategory });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Uppdatera kategori
module.exports.updateCategory = async (request, reply) => {
    errorHandler.resetErrors(err);
    const id = request.params.id;
    const catName = request.body.category_name;

    try {
        // Kontrollera att fält inte är tomt
        const stringCheck = errorHandler.checkEmpty(catName, 'Kategori');
        if (!stringCheck.valid) {
            //Skicka det error som skapas av checkEmpty-funktionen
            return reply.code(stringCheck.error.https_response.code).send(stringCheck.error);
        }

        //Kolla så kategorin finns
        const catToUpdate = await categoryService.findCatById(request.server.mysql, id);
        if (!catToUpdate) {
            err = errorHandler.createError('Not found', 404, 'Hittade ingen kategori');
            return reply.code(404).send(err);
        }

        //Uppdatera
        const updatedCategory = await categoryService.updateCategory(
            request.server.mysql,
            catName,
            id
        );

        return reply.code(200).send({ message: 'Kategori uppdaterad', updatedCategory });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Ta bort kategori
module.exports.deleteCategory = async (request, reply) => {
    errorHandler.resetErrors(err);
    const id = request.params.id;

    try {
        const deletedCategory = await categoryService.findCatById(request.server.mysql, id);

        //Finns ingen användare:
        if (!deletedCategory) {
            err = errorHandler.createError('Not found', 404, 'Hittade ingen kategori');
            return reply.code(404).send(err);
        }

        //Kategorin hittades:
        const deleted = await categoryService.deleteCategory(request.server.mysql, id);
        return reply.send({
            message: 'Kategori raderad!',
            deletedCategory: {
                id: deletedCategory.id,
                category_name: deletedCategory.category_name,
            },
        });
    } catch (error) {
        return reply.code(500).send(error);
    }
};
