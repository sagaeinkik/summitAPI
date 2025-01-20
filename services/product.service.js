'use strict';

/* OBS: Följande queries sker mot products_view, inte tabellen products  */
//Alla produkter
module.exports.findAllProducts = async (mysql) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM products_view');
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av samtliga produkter: ' + error);
        throw error;
    }
};

//Alla produkter inom viss kategori (namn)
module.exports.findProdByCatName = async (mysql, category) => {
    try {
        //Gör case insensitive
        const [rows] = await mysql.query(
            'SELECT * FROM products_view WHERE category_name COLLATE utf8mb4_general_ci = ?',
            category
        );
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av kategorins produkter: ' + error);
        throw error;
    }
};

//Alla produkter från viss leverantör
module.exports.findProdBySupplierName = async (mysql, supplier) => {
    try {
        const [rows] = await mysql.query(
            'SELECT * FROM products_view WHERE supplier_name COLLATE utf8mb4_general_ci = ?',
            supplier
        );
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av leverantörens produkter: ' + error);
        throw error;
    }
};

//Produkt enligt ID
module.exports.findProdById = async (mysql, id) => {
    try {
        const [row] = await mysql.query('SELECT * FROM products_view WHERE product_id = ?', id);
        return row[0];
    } catch (error) {
        console.error('Något gick fel vid hämtning av enskild produkt: ' + error);
        throw error;
    }
};

/* OBS: Följande queries sker mot products, inte vyn products_view */

//Alla produkter i kategori (id)
module.exports.findProdsByCatId = async (mysql, id) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM products WHERE category_id = ?', id);
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av kategorins produkter: ' + error);
        throw error;
    }
};

//Alla produkter av leverantör
module.exports.findProdsBySuppId = async (mysql, id) => {
    try {
        const [rows] = await mysql.query('SELECT * FROM products WHERE supplier_id = ?', id);
        return rows;
    } catch (error) {
        console.error('Något gick fel vid hämtning av leverantörens produkter: ' + error);
        throw error;
    }
};

//Lägg till produkt
module.exports.insertProduct = async (
    mysql,
    productId,
    productName,
    size,
    extra,
    amount,
    inPrice,
    outPrice,
    catId,
    suppId
) => {
    try {
        const row = await mysql.query(
            `INSERT INTO products (product_id, product_name, size, extra, amount, in_price, out_price, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [productId, productName, size, extra, amount, inPrice, outPrice, catId, suppId]
        );

        //Returnera objektet istället för mysql-info
        return {
            id: productId,
            product_name: productName,
            size: size,
            extra: extra,
            amount: amount,
            in_price: inPrice,
            out_price: outPrice,
            category_id: catId,
            supplier_id: suppId,
        };
    } catch (error) {
        console.error('Något gick fel vid tillägg av produkt: ' + error);
        throw error;
    }
};

//Uppdatera produkt
module.exports.updateProduct = async (
    mysql,
    newProdId,
    productName,
    size,
    extra,
    amount,
    inPrice,
    outPrice,
    catId,
    suppId,
    oldProdId
) => {
    try {
        const row = await mysql.query(
            `UPDATE products SET
            product_id = ?,
            product_name = ?, 
            size = ?, 
            extra = ?, 
            amount = ?, 
            in_price = ?, 
            out_price = ?, 
            category_id = ?, 
            supplier_id = ?
            WHERE 
            product_id = ?`,
            [
                newProdId,
                productName,
                size,
                extra,
                amount,
                inPrice,
                outPrice,
                catId,
                suppId,
                oldProdId,
            ]
        );

        //Returnera objektet istället för mysql-info
        return {
            product_id: newProdId,
            product_name: productName,
            size: size,
            extra: extra,
            amount: amount,
            in_price: inPrice,
            out_price: outPrice,
            category_id: catId,
            supplier_id: suppId,
        };
    } catch (error) {
        console.error('Något gick fel vid uppdatering av produkt: ' + error);
        throw error;
    }
};

//Radera produkt
module.exports.deleteProduct = async (mysql, id) => {
    try {
        const row = await mysql.query('DELETE FROM products WHERE product_id = ?', id);
        return row;
    } catch (error) {
        console.error('Något gick fel vid radering: ' + error);
        throw error;
    }
};

//Radera alla produkter från leverantör enligt ID
module.exports.deleteSuppProds = async (mysql, supplierId) => {
    try {
        const row = await mysql.query('DELETE FROM products WHERE supplier_id = ?', supplierId);
        return row;
    } catch (error) {
        console.error(
            'Något gick fel vid borttagning av samtliga produkter från leverantör ' +
                supplierId +
                '. ' +
                error
        );
        throw error;
    }
};

//Radera alla produkter i kategori
module.exports.deleteCatProds = async (mysql, catId) => {
    try {
        const row = await mysql.query('DELETE FROM products WHERE category_id = ?', catId);
        return row;
    } catch (error) {
        console.error(
            'Något gick fel vid borttagning av samtliga produkter i kategori ' +
                catId +
                '. ' +
                error
        );
    }
};
