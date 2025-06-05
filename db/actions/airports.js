const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig'); // đường dẫn tới cấu hình dbConfig

// Lấy danh sách sân bay
router.get('/', async (req, res) => {
try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM Airports');
    res.json(result.recordset);
} catch (err) {
    console.error('Lỗi khi lấy danh sách sân bay:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

// Thêm sân bay mới
router.post('/', async (req, res) => {
const { name, code, location } = req.body;
try {
    await sql.connect(dbConfig);
    await sql.query(`INSERT INTO Airports (name, code, location) VALUES (${name}, ${code}, ${location})`) ;
    res.status(201).send('Thêm sân bay thành công');
} catch (err) {
    console.error('Lỗi khi thêm sân bay:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

// Cập nhật thông tin sân bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { name, code, location } = req.body;
try {
    await sql.connect(dbConfig);
    await sql.query(`UPDATE Airports SET name = ${name}, code = ${code}, location = ${location} WHERE airport_id = ${id}`) ;
    res.send('Cập nhật sân bay thành công');
} catch (err) {
    console.error('Lỗi khi cập nhật sân bay:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

// Xoá sân bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
    await sql.connect(dbConfig);
    await sql.queryDELETE(`FROM Airports WHERE airport_id = ${id}`);
    res.send('Xoá sân bay thành công');
} catch (err) {
    console.error('Lỗi khi xoá sân bay:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;