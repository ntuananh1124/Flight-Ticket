const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    server: 'LAPTOP-GR91AMD2\\ABC', 
    database: 'Flight_Ticket',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

module.exports = { sql, dbConfig };