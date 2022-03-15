const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

pool.getConnection((err, connection) => {
    err ?
        console.log("\33[33mFallo en la conexión." + err) :
        console.log("Base de datos conectada. VAMOS MANAOS!")
})

pool.query = util.promisify(pool.query);
module.exports = pool;