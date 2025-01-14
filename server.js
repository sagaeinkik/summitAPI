//Dependencies osv
const fastify = require('fastify')({
    logger: false,
});
const cors = require('@fastify/cors');
require('dotenv').config();

//Middlewares
fastify.register(cors);

//Routes
fastify.register(require('./routes/users.routes.js'));
fastify.register(require('./routes/categories.routes.js'));

//Välkomstroute
fastify.get('/', async (request, reply) => {
    return {
        meddelande:
            'Hej! Detta är ett API gjort av Saga Einarsdotter Kikajon för kursen Fullstacksutveckling med Ramverk, Mittuniversitetet 2025. Det är gjort med Fastify som ramverk, mot en MySQL-databas.',
    };
});

//App-inställningar
let port = process.env.PORT || 3000;
const connectionString = `mysql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`;

//Databasanslutning
async function dbConnect() {
    try {
        await fastify.register(require('@fastify/mysql'), {
            connectionString: connectionString,
            promise: true,
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
