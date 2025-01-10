//Dependencies osv
const fastify = require('fastify')({
    logger: false,
});
const jwt = require('jsonwebtoken');
const cors = require('@fastify/cors');
require('dotenv').config();

//Middlewares
fastify.register(cors);
fastify.register(require('./routes/products.routes.js'));

//App-inställningar
let port = process.env.PORT || 3000;
const connectionString = `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`;

//Databasanslutning
async function dbConnect() {
    try {
        await fastify.register(require('@fastify/mysql'), {
            connectionString: connectionString,
        });
        console.log('Succé! Ansluten till databasen.');
    } catch (err) {
        console.error('Något gick fel vid databasanslutningen: ' + err);
        throw err;
    }
}

//Kör server
const start = async () => {
    try {
        dbConnect();
        await fastify.listen({ port: port });
        console.log('Succé! Servern är igång på port: ' + port);
    } catch (err) {
        console.error('Något gick fel vid start av applikationen: ' + err);
        throw err;
    }
};
start();
