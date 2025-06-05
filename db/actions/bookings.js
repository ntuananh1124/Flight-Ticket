const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 🟢 GET: Lấy tất cả booking
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Bookings');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách booking:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🟡 POST: Tạo booking mới
router.post('/', async (req, res) => {
const { user_id, flight_id, status } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Bookings (user_id, flight_id, status) VALUES (${user_id}, ${flight_id}, ${status})`) ;
res.status(201).send('Tạo booking thành công');
} catch (err) {
console.error('Lỗi khi tạo booking:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔵 PUT: Cập nhật booking
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { user_id, flight_id, status } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Bookings SET user_id = ${user_id}, flight_id = ${flight_id}, status = ${status} WHERE id = ${id}`) ;
res.send('Cập nhật booking thành công');
} catch (err) {
console.error('Lỗi khi cập nhật booking:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔴 DELETE: Xoá booking
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Bookings WHERE id = ${id}`) ;
res.send('Xoá booking thành công');
} catch (err) {
console.error('Lỗi khi xoá booking:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;