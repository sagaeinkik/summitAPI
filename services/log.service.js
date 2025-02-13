'use strict';

//Hämta 15 loggar
module.exports.findLogs = async (mysql) => {
    try {
        let [rows] = await mysql.query('SELECT * FROM log ORDER BY id DESC LIMIT 15');

        //försök JSON-parse
        rows.forEach((row) => {
            if (row.affected_data) {
                try {
                    row.affected_data = JSON.parse(row.affected_data);
                } catch (err) {
                    console.error('Misslyckades med att parsa affected_data: ', err);
                }
            }
        });

        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av loggar: ' + error);
        throw error;
    }
};

//Hämta upp till 15 loggar enligt handling
module.exports.findActions = async (mysql, action) => {
    try {
        const [rows] = await mysql.query(
            'SELECT * FROM log WHERE action = ? ORDER BY id DESC LIMIT 15',
            action
        );

        //JSON parsing
        rows.forEach((row) => {
            if (row.affected_data) {
                try {
                    row.affected_data = JSON.parse(row.affected_data);
                } catch (err) {
                    console.error('Misslyckades med att parsa affected_data: ', err);
                }
            }
        });

        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av loggar: ' + error);
        throw error;
    }
};
