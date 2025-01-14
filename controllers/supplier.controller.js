'use strict';

const errorHandler = require('../utils/errMsg');
const supplierService = require('../services/supplier.service');

//ERROR-OBJEKT
let err = errorHandler.createError();

//Hämta alla leverantörer
module.exports.getAllSuppliers = async (request, reply) => {
    //Nollställ error
    errorHandler.resetErrors(err);

    try {
        const suppliers = await supplierService.findAllSuppliers(request.server.mysql);

        if (suppliers.length === 0) {
            err = errorHandler.createError('Not found', 404, 'Hittade inga leverantörer');
            return reply.code(404).send(err);
        }

        //Returnera leverantörslista
        return reply.send(suppliers);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Hämta specifik leverantör
module.exports.getSupplierById = async (request, reply) => {
    errorHandler.resetErrors(err);

    try {
        const supplier = await supplierService.findSupplierById(
            request.server.mysql,
            request.params.id
        );

        //Felmeddelande
        if (!supplier) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Hittade ingen leverantör enligt kriterierna'
            );
            return reply.code(404).send(err);
        }

        //Returnera leverantören
        return reply.send(supplier);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Lägg till
module.exports.addSupplier = async (request, reply) => {
    errorHandler.resetErrors(err);
    const { company_name, street_address, area, telephone, email } = request.body;

    //Validera fälten
    const nameCheck = errorHandler.checkEmpty(company_name, 'Företagsnamn');
    const telCheck = errorHandler.checkEmpty(telephone, 'Telefon');
    const emailCheck = errorHandler.checkEmpty(email, 'E-post');

    //Det här är inte det snyggaste jag gjort (förlåt) men...
    if (!nameCheck.valid) {
        return reply.code(nameCheck.error.https_response.code).send(nameCheck.error);
    } else if (!telCheck.valid) {
        return reply.code(telCheck.error.https_response.code).send(telCheck.error);
    } else if (!emailCheck.valid) {
        return reply.code(emailCheck.error.https_response.code).send(emailCheck.error);
    }

    try {
        //Kolla om leverantörnamn redan finns
        const existingCompany = await supplierService.findSupplierByName(
            request.server.mysql,
            company_name
        );

        if (existingCompany) {
            err = errorHandler.createError('Conflict', 409, 'Leverantör finns redan');
            return reply.code(409).send(err);
        }

        //Lägg till leverantör
        const addedCompany = await supplierService.insertSupplier(
            request.server.mysql,
            company_name,
            street_address,
            area,
            telephone,
            email
        );

        return reply.code(201).send({ message: 'Leverantör tillagd', addedCompany });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Uppdatera
module.exports.updateSupplier = async (request, reply) => {
    errorHandler.resetErrors();

    const id = request.params.id;
    const { company_name, street_address, area, telephone, email } = request.body;

    //Validera fält
    const nameCheck = errorHandler.checkEmpty(company_name, 'Företagsnamn');
    const telCheck = errorHandler.checkEmpty(telephone, 'Telefon');
    const emailCheck = errorHandler.checkEmpty(email, 'E-post');

    if (!nameCheck.valid) {
        return reply.code(nameCheck.error.https_response.code).send(nameCheck.error);
    } else if (!telCheck.valid) {
        return reply.code(telCheck.error.https_response.code).send(telCheck.error);
    } else if (!emailCheck.valid) {
        return reply.code(emailCheck.error.https_response.code).send(emailCheck.error);
    }

    try {
        //hitta raden att uppdatera
        const supplierToUpdate = await supplierService.findSupplierById(request.server.mysql, id);
        if (!supplierToUpdate) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Hittade ingen leverantör enligt kriterierna'
            );
            return reply.code(404).send(err);
        }

        //Uppdatera
        const updatedSupplier = await supplierService.updateSupplier(
            request.server.mysql,
            company_name,
            street_address,
            area,
            telephone,
            email,
            id
        );

        //Returnera succé
        return reply.send({ message: 'Leverantör uppdaterad', updatedSupplier });
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Radera
module.exports.deleteSupplier = async (request, reply) => {
    errorHandler.resetErrors(err);
    const id = request.params.id;

    try {
        const deletedSupplier = await supplierService.findSupplierById(request.server.mysql, id);

        //Finns ingen leverantör:
        if (!deletedSupplier) {
            err = errorHandler.createError(
                'Not found',
                404,
                'Hittade ingen leverantör enligt kriterierna'
            );
            return reply.code(404).send(err);
        }

        //leverantören hittades:
        const deleted = await supplierService.deleteSupplier(request.server.mysql, id);
        return reply.send({
            message: 'Leverantör borttagen!',
            deletedSupplier: {
                id: deletedSupplier.id,
                company_name: deletedSupplier.company_name,
                street_address: deletedSupplier.street_address,
                area: deletedSupplier.area,
                telephone: deletedSupplier.telephone,
                email: deletedSupplier.email,
            },
        });
    } catch (error) {
        return reply.code(500).send(error);
    }
};
