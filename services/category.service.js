'use strict';

//Alla kategorier
module.exports.findAll = async (mysql) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM categories');
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av kategorier: ' + error);
        throw error;
    }
};

//Kategori enligt ID
module.exports.findCatById = async (mysql, id) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM categories WHERE id = ?', id);
        return rows[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av kategori: ' + error);
        throw error;
    }
};

//Kategori enligt namn
module.exports.findCatByName = async (mysql, name) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM categories WHERE category_name = ?', name);
        return rows[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av kategori: ' + error);
        throw error;
    }
};

//Lägg till kategori
module.exports.insertCategory = async (mysql, category) => {
    try {
        const rows = await mysql.query(
            'INSERT INTO categories (category_name) VALUES (?)',
            category
        );
        return {
            id: rows[0].insertId,
            category_name: category,
        };
    } catch (error) {
        console.error('Något gick fel vid tillägg av kategori: ' + error);
        throw error;
    }
};

//Ändra kategori
module.exports.updateCategory = async (mysql, category, id) => {
    try {
        const rows = await mysql.query('UPDATE categories SET category_name = ? WHERE id = ?', [
            category,
            id,
        ]);
        return {
            id: id,
            category_name: category,
        };
    } catch (error) {
        console.error('Något gick fel vid ändring av kategori: ' + error);
        throw error;
    }
};

//Radera kategori
module.exports.deleteCategory = async (mysql, id) => {
    try {
        const rows = await mysql.query('DELETE FROM categories WHERE id = ?', id);
        return rows;
    } catch (error) {
        console.error('Något gick fel vid radering av kategori: ' + error);
        throw error;
    }
};
