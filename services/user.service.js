'use strict';

//Hitta alla användare
module.exports.findAll = async (mysql) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM users');
        return rows;
    } catch (err) {
        console.error('Något gick fel vid hämtning av användare: ' + err);
        throw err;
    }
};

//Hitta specifik användare enligt ID
module.exports.findUserById = async (mysql, id) => {
    try {
        const [row] = await mysql.query('SELECT * FROM users WHERE id = ?', id);
        return row[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av användare: ' + err);
        throw err;
    }
};

//Hitta specifik användare enligt användarnamn (användarnamn måste vara unika)
module.exports.findUserByUsername = async (mysql, username) => {
    try {
        //Case insensitive
        const [row] = await mysql.query(
            'SELECT * FROM users WHERE username COLLATE utf8mb4_general_ci = ?',
            username
        );
        return row[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av användare: ' + err);
        throw err;
    }
};

//Lägg till användare
module.exports.insertUser = async (mysql, username, password) => {
    try {
        const rows = await mysql.query('INSERT INTO users (username, password) VALUES (?, ?)', [
            username,
            password,
        ]);
        //Returnera objektet istället för mysql-info
        return {
            id: rows[0].insertId,
            username: username,
        };
    } catch (err) {
        console.error('Något gick fel vid tillägg av användare: ' + err);
        throw err;
    }
};

//Radera användare
module.exports.deleteUser = async (mysql, id) => {
    try {
        const rows = await mysql.query('DELETE FROM users WHERE id = ?', id);
        return rows;
    } catch (err) {
        console.error('Något gick fel vid radering av användare: ' + err);
        throw err;
    }
};

//Byt användarnamn/lösenord
module.exports.updateUser = async (mysql, id, username, password) => {
    try {
        const [rows] = await mysql.query(
            'UPDATE users SET username = ?, password = ? WHERE id = ?',
            [username, password, id]
        );

        //Returnera objektet istället för mysql-info
        return {
            id: id,
            username: username,
        };
    } catch (err) {
        console.error('Något gick fel vid uppdatering av användare: ' + err);
        throw err;
    }
};
