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
exports.resetErrors = (errors) => this.createError();

//Kontrollerar om sträng är tom
exports.checkEmpty = (str, fieldName) => {
    if (!str || str.trim() === '') {
        return {
            valid: false,
            error: this.createError('Bad request', `${fieldName} får ej lämnas tomt.`, 400),
        };
    } else {
        return { valid: true };
    }
};
