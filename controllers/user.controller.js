'use strict';
const errorHandler = require('../utils/errMsg');
const pwHandler = require('../utils/passwordHandler');
const userService = require('../services/user.service');

//ERROR-OBJEKT
let err = errorHandler.createError();

//Hämta alla användare
module.exports.getAllUsers = async (request, reply) => {
    //Nollställ felmeddelanden
    errorHandler.resetErrors(err);

    try {
        //Leta upp användare
        const users = await userService.findAll(request.server.mysql);

        //Kolla om användare hittades
        if (users.length === 0) {
            err = errorHandler.createError('Not found', 404, 'Hittade inga användare');
            return reply.code(404).send(err);
        }

        //Returnera användarlista
        return reply.send(users);
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
            err = errorHandler.createError('Not found', 404, 'Hittade ingen användare');
            return reply.code(404).send(err);
        }

        return reply.send(user);
    } catch (error) {
        return reply.code(500).send(error);
    }
};

//Lägg till användare
module.exports.addUser = async (request, reply) => {
    errorHandler.resetErrors(err);
    const { username, password } = request.body;

    //Validering av fält
    const validResults = [
        errorHandler.checkEmpty(username, 'Användarnamn'),
        errorHandler.checkEmpty(password, 'Lösenord'),
    ];
    //Kolla igenom validResults efter error
    const validError = errorHandler.validateFields(reply, validResults);
    if (validError) {
        return validError;
    }

    try {
        //Försök hitta användare med samma användarnamn
        const existingUser = await userService.findUserByUsername(request.server.mysql, username);

        if (existingUser) {
            err = errorHandler.createError('Conflict', 409, 'Upptaget användarnamn');
            return reply.code(409).send(err);
        }

        //Hasha lösenord
        const hashedPassword = await pwHandler.hashPassword(password);

        //Lägg till användare
        const newUser = await userService.insertUser(
            request.server.mysql,
            username,
            hashedPassword
        );
        //Skapa token
        const token = pwHandler.createToken(username);

        //Returnera succé
        return reply.code(201).send({ message: 'Användare tillagd', newUser, token: token });
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
            err = errorHandler.createError('Not found', 404, 'Hittade ingen användare');
            return reply.code(404).send(err);
        }
        //Jämför lösenord
        const authorized = await pwHandler.verifyPassword(password, user.password);

        //Om lösenord stämmer
        if (authorized) {
            //Skapa token
            const token = pwHandler.createToken(username);
            return reply.send({
                message: 'Inloggning lyckades',
                loggedInUser: { id: user.id, username: username },
                token: token,
            });
        } else {
            //Felmeddelande
            err = errorHandler.createError('Unauthorized', 401, 'Fel användarnamn eller lösenord');
            return reply.code(401).send(err);
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

    //Validering av fält
    const validResults = [
        errorHandler.checkEmpty(username, 'Användarnamn'),
        errorHandler.checkEmpty(password, 'Lösenord'),
    ];
    //Kolla igenom validResults efter error
    const validError = errorHandler.validateFields(reply, validResults);
    if (validError) {
        return validError;
    }

    try {
        //Försök hitta användare enligt ID
        const user = await userService.findUserById(request.server.mysql, id);

        //Kolla om användare finns
        if (!user) {
            err = errorHandler.createError('Not found', 404, 'Hittade ingen användare');
            return reply.code(404).send(err);
        }
        /* Hamnar vi här finns användaren.
        Kontrollera att det är användaren som är inloggad som gör requesten för att ändra (så man inte kan ändra andras konton) */
        await pwHandler.authenticateToken(request, reply);

        //Namnet stämmer inte:
        if (request.username !== user.username) {
            err = errorHandler.createError(
                'Unauthorized',
                403,
                'Du är obehörig att utföra denna åtgärd.'
            );
            return reply.code(403).send(err);
        }

        //Hasha lösenord
        const hashedPassword = await pwHandler.hashPassword(password);

        //Uppdatera användare
        await userService.updateUser(request.server.mysql, id, username, hashedPassword);
        return reply.send({
            message: 'Användare uppdaterad!',
            updatedUser: { id: id, username: username },
        });
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
            err = errorHandler.createError('Not found', 404, 'Hittade ingen användare');
            return reply.code(404).send(err);
        }

        /* Hamnar vi här finns användaren.
        Kontrollera att det är användaren som är inloggad som gör requesten för att radera (så man inte kan radera andras konton) */
        await pwHandler.authenticateToken(request, reply);

        //Namnet stämmer inte:
        if (request.username !== deletedUser.username) {
            err = errorHandler.createError(
                'Unauthorized',
                403,
                'Du är obehörig att utföra denna åtgärd.'
            );
            return reply.code(403).send(err);
        } else {
            //Namnet stämmer: radera
            await userService.deleteUser(request.server.mysql, id);
            return reply.send({
                message: 'Användare raderad!',
                deletedUser: {
                    id: deletedUser.id,
                    username: deletedUser.username,
                },
            });
        }
    } catch (error) {
        return reply.code(500).send(error);
    }
};
