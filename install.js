'use strict';
const fastify = require('fastify')();
require('dotenv').config();

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

//Funktion för att linda in queries i promise och använda async/await
function asyncQuery(query, params = []) {
    //Skapa promise
    return new Promise((resolve, reject) => {
        //Skapa query
        fastify.mysql.query(query, params, (err, result) => {
            if (err) {
                console.error('Något gick fel vid query: ' + err);
                reject(err);
            } else {
                console.log('Query lyckades!');
                resolve(result);
            }
        });
    });
}

/* QUERIES */

//Users
async function usersTable() {
    try {
        //Droppa tabell
        await asyncQuery('DROP TABLE IF EXISTS users');
        console.log('Tabell Users togs bort \n');

        //Skapa tabell
        await asyncQuery(`CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(255) NOT NULL, 
            password VARCHAR(255) NOT NULL, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        console.log('Tabell Users skapades \n');
    } catch (error) {
        console.error('Något gick fel vid users query: ' + error);
    }
}

//Kategorier
async function categoriesTable() {
    try {
        //Droppa tabell
        await asyncQuery('DROP TABLE IF EXISTS categories');
        console.log('Tabell Categories togs bort \n');

        //Skapa tabell
        await asyncQuery(`CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            name VARCHAR(255) NOT NULL
            )`);
        console.log('Tabell Categories skapades \n');
    } catch (error) {
        console.error('Något gick fel vid categories query: ' + error);
    }
}

//Produkter

//Leverantörer

//Logg
async function logTable() {
    try {
        //Droppa tabell
        await asyncQuery('DROP TABLE IF EXISTS log');
        console.log('Tabell Log togs bort \n');

        //Skapa tabell
        await asyncQuery(`CREATE TABLE log (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            action ENUM ("insert", "update", "delete"), 
            table_name VARCHAR(255),
            affected_id INT,
            affected_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        console.log('Tabell Log skapades \n');
    } catch (error) {
        console.error('Något gick fel vid borttagning av log: ' + error);
    }
}

/* TRIGGERS */
async function categoryTriggers() {
    try {
        //Trigger för inserts
        await asyncQuery(`CREATE TRIGGER category_insert AFTER INSERT ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('insert', 'categories', NEW.id, JSON_OBJECT('name', NEW.name))`);
        console.log('Trigger category_insert skapades \n');

        //Trigger för updates
        await asyncQuery(`CREATE TRIGGER category_update AFTER UPDATE ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('update', 'categories', NEW.id, JSON_OBJECT('name', NEW.name))`);
        console.log('Trigger category_update skapades \n');

        //Trigger för deletes
        await asyncQuery(`CREATE TRIGGER category_delete AFTER DELETE ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('delete', 'categories', OLD.id, JSON_OBJECT('name', OLD.name))`);
        console.log('Trigger category_delete skapades \n');
    } catch (error) {
        console.error('Något gick fel vid skapande av triggers: ' + error);
    }
}

//Kör allt
(async () => {
    try {
        //Anslut
        await dbConnect();

        //Tabeller
        await usersTable();
        await categoriesTable();
        await logTable();

        //Triggers
        await categoryTriggers();
    } catch (error) {
        console.error('Något gick fel vid körning av install.js: ' + error);
    } finally {
        console.log('Stänger ner databasanslutning...');
        await fastify.mysql.pool.end();
    }
})();
