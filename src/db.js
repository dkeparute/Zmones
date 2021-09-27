import * as mysql from "mysql";

const OPTIONS = {
    host: 'localhost',
    user: 'zmones',
    password: 'zmones',
    database: 'zmones',
    // tam kad apsaugoti nuo injection attack'u
    multipleStatements: true,
};

// CONNECTION POOL SUKURIMAS
const pool = mysql.createPool(OPTIONS);


function connect() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            resolve(conn);
        });
    });
}

function query(conn, sql, values) {
    return new Promise((resolve, reject) => {
        conn.query({
            sql,
            values
        }, (err, results, fields) => {
            if (err) {
                return reject(err);
            }
            resolve({ results, fields });
        });
    });
}

// sukuriama funkcija bandant atsijungti, naudojama POOL
function end(conn) {
    return new Promise((resolve, reject) => {
        if (conn) {
            conn.release();
        }
        resolve();
    });
}
// DABAR SERVERIS NE UZDARINEJA CONNECTION O ATGAL GRAZINA I POOL

export { connect, query, end };