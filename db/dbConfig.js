const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    server: 'LAPTOP-GR91AMD2\\ABC', // ghép server và instance lại bằng dấu \\
    database: 'Flight_Ticket',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true // dùng Windows Authentication
    }
};

module.exports = { sql, dbConfig };