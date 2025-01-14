'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');
const errHandler = require('./errMsg');

//Skapa web token
const expirationDate = 60 * 60 * 3; //Tre timmar

module.exports.createToken = (username) => {
    return jwt.sign({ username }, jwtKey, { expiresIn: expirationDate });
};

//Validera token
module.exports.authenticateToken = async (request, reply) => {
    let err = errHandler.createError();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Själva token utan ord

    //Header saknas helt
    if (!authHeader) {
        err = errHandler.createError('Unauthorized', 401, 'Missing Token');
        return reply.code(401).send(err);
    }

    //Token saknas
    if (!token) {
        err = errHandler.createError('Unauthorized', 401, 'Missing Token');
        return reply.code(401).send(err);
    }

    //Har vi kommit hit kan vi jämföra token med nyckel
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            err = errHandler.createError('Unauthorized', 403, 'Invalid Token');
            return reply.code(403).send(err);
        }

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
