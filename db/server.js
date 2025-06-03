const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Không cần export sql/dbConfig nữa
const userRoutes = require('./actions/users');

// API chuyến bay (ví dụ)
const { sql, dbConfig } = require('./dbConfig');
app.get('/api/flights', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Flights');
        res.json(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send("Lỗi kết nối CSDL");
    }
});

// Route người dùng
app.use('/api/users', userRoutes);

// Khởi động
app.listen(5000, () => {
    console.log('API đang chạy tại http://localhost:5000');
});