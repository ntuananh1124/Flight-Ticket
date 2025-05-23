const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⚙️ Cấu hình kết nối SQL Server
// const dbConfig = {
//     server: 'LAPTOP-GR91AMD2',
//     user: 'ntuananh1124',
//     password: '123456',
//     database: 'Flight_Ticket',
//     // port: '1433',
//     options: {
//         encrypt: false,
//         trustServerCertificate: true,
//         instanceName: 'ABC' 
//     }
// };
const dbConfig = {
    server: 'DESKTOP-0AJOA50\\SQLEXPRESS', // ghép server và instance lại bằng dấu \\
    database: 'Flight_Ticket',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true // dùng Windows Authentication
    }
};

// 📡 API: Lấy danh sách chuyến bay
app.get('/api/flights', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`SELECT * FROM Flights`);
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        console.log('err');
        res.status(500).send("Lỗi kết nối CSDL");
    }
});

// 🔌 Khởi chạy server
app.listen(5000, () => {
    console.log('API đang chạy tại http://localhost:5000');
});
