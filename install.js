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
        console.log('Succé! Ansluten till databasen. \n');
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
//Ta bort alla
async function dropAllTables() {
    try {
        console.log('Tar bort alla tabeller...');
        await asyncQuery('DROP TABLE IF EXISTS users');
        await asyncQuery('DROP TABLE IF EXISTS products');
        await asyncQuery('DROP TABLE IF EXISTS categories');
        await asyncQuery('DROP TABLE IF EXISTS suppliers');
        await asyncQuery('DROP TABLE IF EXISTS log');
        await asyncQuery('DROP VIEW IF EXISTS products_view');
        console.log('Alla tabeller togs bort \n');
    } catch (error) {
        console.error('Något gick fel vid borttagning av tabeller: ' + error);
    }
}

//Users
async function usersTable() {
    try {
        //Skapa tabell
        await asyncQuery(`CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
            username VARCHAR(255) UNIQUE NOT NULL, 
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
        //Skapa tabell
        await asyncQuery(`CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
            category_name VARCHAR(255) UNIQUE NOT NULL
            )`);
        console.log('Tabell Categories skapades \n');
    } catch (error) {
        console.error('Något gick fel vid categories query: ' + error);
    }
}

//Leverantörer
async function suppliersTable() {
    try {
        //Skapa tabell
        await asyncQuery(`CREATE TABLE suppliers (
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
            company_name VARCHAR(255) UNIQUE NOT NULL,
            street_address VARCHAR(255),
            area VARCHAR(255),
            telephone VARCHAR(30),
            email VARCHAR(255)
            )`);
        console.log('Tabell Suppliers skapades \n');
    } catch (error) {
        console.error('Något gick fel vid suppliers query: ' + error);
    }
}

//Produkter - avrunda priser till närmsta krona (vi gjorde så på mitt jobb)
async function productsTable() {
    try {
        //Skapa tabell
        await asyncQuery(`CREATE TABLE products (
            product_id VARCHAR(30) PRIMARY KEY NOT NULL, 
            product_name VARCHAR(255) NOT NULL, 
            size VARCHAR(30),
            extra VARCHAR(30),
            amount INT NOT NULL, 
            in_price INT NOT NULL, 
            out_price INT NOT NULL,
            category_id INT NOT NULL, 
            supplier_id INT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id), 
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
            )`);
        console.log('Tabell Products skapades \n');
    } catch (error) {
        console.error('Något gick fel vid products query: ' + error);
    }
}

//Logg
async function logTable() {
    try {
        //Skapa tabell
        await asyncQuery(`CREATE TABLE log (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            action ENUM ("insert", "update", "delete"), 
            table_name VARCHAR(255),
            affected_id INT,
            affected_data JSON,
            logged_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        console.log('Tabell Log skapades \n');
    } catch (error) {
        console.error('Något gick fel vid borttagning av log: ' + error);
    }
}

/* INSERTS OM MAN INTE VILL SKRIVA SJÄLV*/
/* 
async function inserts() {
    try {
        await asyncQuery(`INSERT INTO categories (category_name) VALUES ("Testkategori");`);
        await asyncQuery(`INSERT INTO categories (category_name) VALUES ("Testkategori2");`);
        await asyncQuery(`INSERT INTO categories (category_name) VALUES ("Testkategori3");`);
        await asyncQuery(
            `INSERT INTO suppliers (company_name, street_address, area, telephone, email) VALUES ("Testföretag 1", "Testgatan 10", "Tångböle", "06523213", "mail@mail.se");`
        );
        await asyncQuery(
            `INSERT INTO suppliers (company_name, street_address, area, telephone, email) VALUES ("Testföretag 2", "Testgatan 20", "Trångsviken", "06523213", "mail@mail.com");`
        );
        await asyncQuery(
            `INSERT INTO suppliers (company_name, street_address, area, telephone, email) VALUES ("BackCountry AB", "Testgatan 40", "Dalarna", "06523213", "hej@mail.com");`
        );
        await asyncQuery(
            `INSERT INTO products (product_id, product_name, size, extra, amount, in_price, out_price, category_id, supplier_id) VALUES ("4", "Sten", "Small", "Grå", "15", 23, 79, 2, 1);`
        );
        await asyncQuery(
            `INSERT INTO products (product_id, product_name, size, extra, amount, in_price, out_price, category_id, supplier_id) VALUES ("1", "Planka", "170", "Furu", "2", 52, 234, 2, 2);`
        );
        await asyncQuery(
            `INSERT INTO products (product_id, product_name, size, extra, amount, in_price, out_price, category_id, supplier_id) VALUES ("2", "Åska", null, "Pang", "1", 123213, 743242349, 1, 3);`
        );
        await asyncQuery(
            `INSERT INTO products (product_id, product_name, size, extra, amount, in_price, out_price, category_id, supplier_id) VALUES ("3", "Vän", "XL", "Grå", "15", 23, 79, 3, 1);`
        );
    } catch (error) {
        console.error('Något gick fel vid djsakda' + error);
    }
} */

/* TRIGGERS */

//Kategoritriggers
async function categoryTriggers() {
    try {
        //Trigger för inserts
        await asyncQuery(`CREATE TRIGGER category_insert AFTER INSERT ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('insert', 'categories', NEW.id, JSON_OBJECT('id', NEW.id, 'category_name', NEW.category_name))`);
        console.log('Trigger category_insert skapades \n');

        //Trigger för updates
        await asyncQuery(`CREATE TRIGGER category_update AFTER UPDATE ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('update', 'categories', NEW.id, JSON_OBJECT('id', NEW.id, 'category_name', NEW.category_name))`);
        console.log('Trigger category_update skapades \n');

        //Trigger för deletes
        await asyncQuery(`CREATE TRIGGER category_delete AFTER DELETE ON categories
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('delete', 'categories', OLD.id, JSON_OBJECT('id', OLD.id, 'category_name', OLD.category_name))`);
        console.log('Trigger category_delete skapades \n');
    } catch (error) {
        console.error('Något gick fel vid skapande av triggers: ' + error);
    }
}

//Leverantörtriggers
async function supplierTriggers() {
    try {
        //Trigger för inserts
        await asyncQuery(`CREATE TRIGGER supplier_insert AFTER INSERT ON suppliers
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('insert', 'suppliers', NEW.id, JSON_OBJECT('id', NEW.id, 'company_name', NEW.company_name, 'street_address', NEW.street_address, 'area', NEW.area, 'telephone', NEW.telephone, 'email', NEW.email))`);
        console.log('Trigger supplier_insert skapades \n');

        //Trigger för updates
        await asyncQuery(`CREATE TRIGGER supplier_update AFTER UPDATE ON suppliers
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('update', 'suppliers', NEW.id, JSON_OBJECT('id', NEW.id, 'company_name', NEW.company_name, 'street_address', NEW.street_address, 'area', NEW.area, 'telephone', NEW.telephone, 'email', NEW.email))`);
        console.log('Trigger supplier_update skapades \n');

        //Trigger för deletes
        await asyncQuery(`CREATE TRIGGER supplier_delete AFTER DELETE ON suppliers
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('delete', 'suppliers', OLD.id, JSON_OBJECT('id', OLD.id, 'company_name', OLD.company_name, 'street_address', OLD.street_address, 'area', OLD.area, 'telephone', OLD.telephone, 'email', OLD.email))`);
        console.log('Trigger supplier_delete skapades \n');
    } catch (error) {
        console.error('Något gick fel vid skapande av triggers: ' + error);
    }
}

//Produk-triggers
async function productTriggers() {
    try {
        //Trigger för inserts
        await asyncQuery(`CREATE TRIGGER products_insert AFTER INSERT ON products
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('insert', 'products', NEW.product_id, JSON_OBJECT('product_id', NEW.product_id, 'product_name', NEW.product_name, 'size', NEW.size, 'extra', NEW.extra, 'amount', NEW.amount, 'in_price', NEW.in_price, 'out_price', NEW.out_price, 'category_id', NEW.category_id, 'supplier_id', NEW.supplier_id))`);
        console.log('Trigger supplier_insert skapades \n');

        //Trigger för updates
        await asyncQuery(`CREATE TRIGGER products_update AFTER UPDATE ON products
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('update', 'products', NEW.product_id, JSON_OBJECT('product_id', NEW.product_id, 'product_name', NEW.product_name, 'size', NEW.size, 'extra', NEW.extra, 'amount', NEW.amount, 'in_price', NEW.in_price, 'out_price', NEW.out_price, 'category_id', NEW.category_id, 'supplier_id', NEW.supplier_id))`);
        console.log('Trigger products_update skapades \n');

        //Trigger för deletes
        await asyncQuery(`CREATE TRIGGER products_delete AFTER DELETE ON products
            FOR EACH ROW
            INSERT INTO log (action, table_name, affected_id, affected_data)
            VALUES ('delete', 'products', OLD.product_id, JSON_OBJECT('product_id', OLD.product_id, 'product_name', OLD.product_name, 'size', OLD.size, 'extra', OLD.extra, 'amount', OLD.amount, 'in_price', OLD.in_price, 'out_price', OLD.out_price, 'category_id', OLD.category_id, 'supplier_id', OLD.supplier_id))`);
        console.log('Trigger products_delete skapades \n');
    } catch (error) {
        console.error('Något gick fel vid skapande av triggers: ' + error);
    }
}

/* VIEWS */
//Product-view (blir lättare att skriva ut produkterna på appen sen)
async function productView() {
    try {
        //Skapa view
        await asyncQuery(`CREATE VIEW products_view AS
            SELECT 
                p.product_id,
                p.product_name,
                p.size,
                p.extra,
                p.amount,
                p.in_price,
                p.out_price,
                c.category_name,
                s.company_name AS supplier_name
            FROM 
                products p
            JOIN 
                categories c ON p.category_id = c.id
            JOIN
                suppliers s ON p.supplier_id = s.id;`);

        console.log('View Product_view skapades \n');
    } catch (error) {
        console.error('Något gick fel vid product_view query: ' + error);
    }
}

//Kör allt
(async () => {
    try {
        //Anslut
        await dbConnect();
        await dropAllTables();

        //Tabeller
        await usersTable();
        await categoriesTable();
        await suppliersTable();
        await productsTable();
        await logTable();

        /* await inserts(); */

        //Triggers
        await categoryTriggers();
        await supplierTriggers();
        await productTriggers();

        //Views
        await productView();
        await console.log('Klar!');
    } catch (error) {
        console.error('Något gick fel vid körning av install.js: ' + error);
    } finally {
        await fastify.mysql.pool.end();
        await console.log('Databasanslutning stängd.');
    }
})();
