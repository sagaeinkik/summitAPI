'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');

//Skapa web token
const expirationDate = 60 * 60 * 3; //Tre timmar

module.exports.createToken = (username) => {
    return jwt.sign({ username }, jwtKey, { expiresIn: expirationDate });
};

//Validera token
module.exports.authenticateToken = async (request, reply) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Själva token utan ord

    //Header saknas helt
    if (!authHeader) {
        return reply.code(401).send({ message: 'Unauthorized, missing token' });
    }

    //Token saknas
    if (!token) return reply.code(401).send({ message: 'Unauthorized, missing token' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return reply.code(403).send({ message: 'Unauthorized, invalid token' });

        request.username = user.username;
    });
};

//Hasha lösenord
module.exports.hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Fel vid kryptering av lösenord:', error);
        throw new Error('Kunde inte kryptera lösenord');
    }
};

//Jämför lösenord
module.exports.verifyPassword = async (password, hashedPassword) => {
    try {
        const authorized = await bcrypt.compare(password, hashedPassword);
        return authorized;
    } catch (error) {
        console.error('Fel vid jämförelse av lösenord:', error);
        throw new Error('Kunde inte jämföra lösenord');
    }
};
