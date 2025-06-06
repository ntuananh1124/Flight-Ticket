const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📥 GET: Lấy danh sách các tuyến bay
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Routes');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách Routes:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Thêm tuyến bay mới
router.post('/', async (req, res) => {
    const { from_airport, to_airport, distance_km } = req.body;

    try {
    await sql.connect(dbConfig);
await sql.query(`INSERT INTO Routes (from_airport, to_airport, distance_km) VALUES (${from_airport}, ${to_airport}, ${distance_km})`) ;
res.status(201).send('Thêm tuyến bay thành công');
} catch (err) {
console.error('Lỗi khi thêm tuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔄 PUT: Cập nhật tuyến bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { from_airport, to_airport, distance_km } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Routes SET from_airport = ${from_airport}, to_airport = ${to_airport}, distance_km = ${distance_km} WHERE route_id = ${id}`) ;
res.send('Cập nhật tuyến bay thành công');
} catch (err) {
console.error('Lỗi khi cập nhật tuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá tuyến bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Routes WHERE route_id = ${id}`) ;
res.send('Xoá tuyến bay thành công');
} catch (err) {
console.error('Lỗi khi xoá tuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;