'use strict';
const errorHandler = require('../utils/errMsg');
const pwHandler = require('../utils/passwordHandler');
const userService = require('../services/userService');

//ERROR-OBJEKT
let err = {
    https_response: {
        message: '',
        code: '',
    },
    message: '',
    details: '',
};

//Hämta alla användare
module.exports.getAllUsers = async (request, reply) => {
    //Nollställ felmeddelanden
    errorHandler.resetErrors(err);

    try {
        //Leta upp användare
        const users = await userService.findAll(request.server.mysql);

        //Kolla om användare hittades
        if (users.length === 0) {
            err.https_response.message = 'Not found';
            err.https_response.code = 404;
            err.message = 'Hittade inga användare';
            return reply.code(404).send(err);
        } else {
            return reply.status(200).send(users);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Hämta specifik användare
module.exports.getSingleUser = async (request, reply) => {
    errorHandler.resetErrors(err);

    try {
        const user = await userService.findUserById(request.server.mysql, request.params.id);

        //Kolla om användare finns
        if (!user) {
            err.https_response.message = 'Not found';
            err.https_response.code = 404;
            err.message = 'Hittade ingen användare';
            return reply.code(404).send(err);
        } else {
            return reply.status(200).send(user);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Lägg till användare
module.exports.addUser = async (request, reply) => {
    errorHandler.resetErrors(err);
    const { username, password } = request.body;

    //Kolla om användarnamn är tomt
    if (!username || username.trim() === '') {
        err.https_response.message = 'Bad request';
        err.https_response.code = 400;
        err.message = 'Användarnamn saknas';
        return reply.code(400).send(err);
    }
    if (!password || password.trim() === '') {
        err.https_response.message = 'Bad request';
        err.https_response.code = 400;
        err.message = 'Lösenord saknas';
        return reply.code(400).send(err);
    }
    try {
        //Försök hitta användare med samma användarnamn
        const existingUser = await userService.findUserByUsername(request.server.mysql, username);

        if (existingUser) {
            err.https_response.message = 'Conflict';
            err.https_response.code = 409;
            err.message = 'Upptaget användarnamn';
            return reply.code(409).send(err);
        } else {
            //Hasha lösenord
            const hashedPassword = await pwHandler.hashPassword(password);
            //Skapa användar-objekt
            let newUser = {
                username: username,
                password: hashedPassword,
            };

            //Lägg till användare
            await userService.insertUser(request.server.mysql, username, hashedPassword);
            //Skapa token
            const token = pwHandler.createToken(username);

            //Returnera succé
            return reply.code(201).send(['Användare tillagd!', newUser.username, token]);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Logga in användare
module.exports.loginUser = async (request, reply) => {
    errorHandler.resetErrors(err);
    const { username, password } = request.body;

    try {
        //Hämta användare
        const user = await userService.findUserByUsername(request.server.mysql, username);

        //Kolla om användare finns
        if (!user) {
            err.https_response.message = 'Not found';
            err.https_response.code = 404;
            err.message = 'Hittade ingen användare';
            return reply.code(404).send(err);
        } else {
            //Jämför lösenord
            const authorized = await pwHandler.verifyPassword(password, user.password);

            if (authorized) {
                //Skapa token
                const token = pwHandler.createToken(username);
                return reply
                    .code(200)
                    .send([
                        'Inloggning lyckades',
                        { användarnamn: user.username },
                        { token: token },
                    ]);
            } else {
                err.https_response.message = 'Unauthorized';
                err.https_response.code = 401;
                err.message = 'Fel användarnamn eller lösenord.';
                return reply.code(401).send(err);
            }
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Uppdatera användare
module.exports.updateUser = async (request, reply) => {
    errorHandler.resetErrors(err);
    const { username, password } = request.body;
    const id = request.params.id;

    try {
        //Försök hitta användare enligt ID
        const user = await userService.findUserById(request.server.mysql, id);

        //Kolla om användare finns
        if (!user) {
            err.https_response.message = 'Not found';
            err.https_response.code = 404;
            err.message = 'Hittade ingen användare';

            return reply.code(404).send(err);
        } else {
            //Hasha lösenord
            const hashedPassword = await pwHandler.hashPassword(password);
            //Uppdatera användare
            await userService.updateUser(request.server.mysql, id, username, hashedPassword);
            return reply.code(200).send(['Användare uppdaterad!', { användarnamn: username }]);
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Radera användare
module.exports.deleteUser = async (request, reply) => {
    errorHandler.resetErrors(err);

    const id = request.params.id;

    try {
        //Hitta användaren
        const deletedUser = await userService.findUserById(request.server.mysql, id);

        //Finns ingen användare:
        if (!deletedUser) {
            err.https_response.message = 'Not found';
            err.https_response.code = 404;
            err.message = 'Hittade ingen användare';

            return reply.code(404).send(err);
        } else {
            //Användare finns:
            //Autentisera med token
            await pwHandler.authenticateToken(request, reply);

            //Namnet stämmer inte:
            if (request.username !== deletedUser.username) {
                return reply.code(403).send([{ message: 'Unauthorized' }]);
            } else {
                //Namnet stämmer: radera
                const deleted = await userService.deleteUser(request.server.mysql, id);
                return reply
                    .code(200)
                    .send(['Användare raderad!', { deletedUser: deletedUser.username }, deleted]);
            }
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};
