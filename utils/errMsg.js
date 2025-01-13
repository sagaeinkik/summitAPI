'use strict';

//Funktion som nollställer error-objektet
exports.resetErrors = (errors) => {
    //Loopa igenom alla nycklar i objektet
    Object.keys(errors).forEach((key) => {
        //Om det finns nested objects, loopa igenom dom också
        if (typeof errors[key] === 'object') {
            //Nollställ till tom sträng
            Object.keys(errors[key]).forEach((subKey) => {
                errors[key][subKey] = '';
            });
        } else {
            //Nollställ till tom sträng
            errors[key] = '';
        }
    });
};
