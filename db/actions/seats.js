const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📥 GET: Lấy tất cả ghế
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Seats');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy ghế:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Thêm ghế mới
router.post('/', async (req, res) => {
const { airplane_id, seat_number, class: seatClass } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Seats (airplane_id, seat_number, class) VALUES (${airplane_id}, ${seat_number}, ${seatClass})`) ;
res.status(201).send('Thêm ghế thành công');
} catch (err) {
console.error('Lỗi khi thêm ghế:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔄 PUT: Cập nhật thông tin ghế
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { airplane_id, seat_number, class: seatClass } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Seats SET airplane_id = ${airplane_id}, seat_number = ${seat_number}, class = ${seatClass} WHERE seat_id = ${id}`) ;
res.send('Cập nhật ghế thành công');
} catch (err) {
console.error('Lỗi khi cập nhật ghế:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá ghế
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Seats WHERE seat_id = ${id}`) ;
res.send('Xoá ghế thành công');
} catch (err) {
console.error('Lỗi khi xoá ghế:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;