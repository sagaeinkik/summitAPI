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
module.exports.authenticateToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Själva token utan ord

    if (!token) return res.status(401).send({ message: 'Unauthorized, missing token' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send({ message: 'Unauthorized, invalid token' });

        req.username = user.username;
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
