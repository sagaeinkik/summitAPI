//Generera fram en JWT-SECRET-KEY till .env-filen
const crypto = require('crypto');
const random = crypto.randomBytes(64).toString('hex');
console.log(random);
