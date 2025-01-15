'use strict';

//Alla leverantörer
module.exports.findAllSuppliers = async (mysql) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM suppliers');
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av leverantörer: ' + error);
        throw error;
    }
};

//Leverantör enligt ID
module.exports.findSupplierById = async (mysql, id) => {
    try {
        const [row] = await mysql.query('SELECT * FROM suppliers WHERE id = ?', id);
        return row[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av leverantör: ' + error);
        throw error;
    }
};

//Leverantör enligt namn (company_name är satt till UNIQUE)
module.exports.findSupplierByName = async (mysql, name) => {
    try {
        //Gör case insensitive
        const [row] = await mysql.query(
            'SELECT * FROM suppliers WHERE company_name COLLATE utf8mb4_general_ci = ?',
            name
        );
        return row[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av leverantör: ' + error);
        throw error;
    }
};

//Lägg till leverantör
module.exports.insertSupplier = async (
    mysql,
    companyName,
    streetAddress,
    area,
    telephone,
    email
) => {
    try {
        const row = await mysql.query(
            'INSERT INTO suppliers (company_name, street_address, area, telephone, email) VALUES (?, ?, ?, ?, ?)',
            [companyName, streetAddress, area, telephone, email]
        );
        //Returnera objektet istället för mysql-info
        return {
            id: row[0].insertId,
            company_name: companyName,
            street_address: streetAddress,
            area: area,
            telephone: telephone,
            email: email,
        };
    } catch (error) {
        console.error('Något gick fel vid skapande av leverantör: ' + error);
        throw error;
    }
};

//Ändra leverantör
module.exports.updateSupplier = async (
    mysql,
    companyName,
    streetAddress,
    area,
    telephone,
    email,
    id
) => {
    try {
        const row = await mysql.query(
            'UPDATE suppliers SET company_name = ?, street_address = ?, area = ?, telephone = ?, email = ? WHERE id = ?',
            [companyName, streetAddress, area, telephone, email, id]
        );
        //Returnera objektet istället för mysql-info
        return {
            id: id,
            company_name: companyName,
            street_address: streetAddress,
            area: area,
            telephone: telephone,
            email: email,
        };
    } catch (error) {
        console.error('Något gick fel vid uppdatering av leverantör: ' + error);
        throw error;
    }
};

//Radera leverantör
module.exports.deleteSupplier = async (mysql, id) => {
    try {
        const row = await mysql.query('DELETE FROM suppliers WHERE id = ?', id);
        return row;
    } catch (error) {
        console.error('Något gick fel vid radering av leverantör: ' + error);
        throw error;
    }
};
