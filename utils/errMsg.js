'use strict';

//Grundstruktur error-objekt
exports.createError = (httpsmessage = '', code = '', message = '', details = '') => ({
    https_response: {
        message: httpsmessage,
        code: code,
    },
    message: message,
    details: details,
});

//Funktion som nollställer error-objektet
exports.resetErrors = (error) => exports.createError();

//Kontrollerar om något är tomt, null, undefined, på annat sätt ogiltigt
exports.checkEmpty = (val, fieldName) => {
    if (
        val === null ||
        val === undefined ||
        (typeof val === 'string' && val.trim() === '') ||
        val === ''
    ) {
        return {
            valid: false,
            error: exports.createError('Bad request', 400, `${fieldName} får ej lämnas tomt.`),
        };
    } else {
        return { valid: true };
    }
};

//Funktion som tar array av valideringsresultat och kollar igenom efter error
exports.validateFields = (reply, validation) => {
    //Loopa igenom arrayen
    for (const result of validation) {
        //Om det är fel
        if (!result.valid) {
            return reply.code(result.error.https_response.code).send(result.error);
        }
    }
    return null;
};
