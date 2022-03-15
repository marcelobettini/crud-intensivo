const pool = require("../db");

const getProducts = async() => {
    try {
        const query = "select * from products"
        const rows = await pool.query(query)
        return rows;
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async(id) => {
    try {
        const query = `DELETE FROM products WHERE id = ${id}`;
        const result = await pool.query(query);
        return result
    } catch (err) {
        console.log(err)
    }
}

const getProductById = async(id) => {
    try {
        const query = `SELECT * FROM products WHERE id = ${id}`;
        const result = await pool.query(query);
        return result
    } catch (err) {
        console.log(err)
    }
}

const addProduct = async(data) => {

    // antes de enviar el nuevo registro a la base de datos, enviamos solamente el archivo
    //a Cloudinary, este servicio les va a devolver el ID único del archivo, y ese ID es el
    //que vamos a almacenar en el campo image o como se llame de la base de datos, junto
    //con los demás campos (name, etc...)
    try {

        const query = `INSERT INTO products SET ?`
        const row = await pool.query(query, [data])
        return row;
    } catch (error) {
        console.log(error)
    }
}

const modifyProduct = async(data, id) => {
    try {
        const query = "UPDATE products SET ? WHERE id = ?"
        const result = await pool.query(query, [data, id])
        return result;

    } catch (err) {
        console.log(err)
    }

}
module.exports = { getProducts, deleteProduct, addProduct, getProductById, modifyProduct }