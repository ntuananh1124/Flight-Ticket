const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 🟢 GET: Lấy tất cả payments
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Payments');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách payments:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🟡 POST: Thêm payment mới
router.post('/', async (req, res) => {
const { booking_id, amount, payment_method } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Payments (booking_id, amount, payment_method) VALUES (${booking_id}, ${amount}, ${payment_method})`) ;
res.status(201).send('Tạo payment thành công');
} catch (err) {
console.error('Lỗi khi tạo payment:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔵 PUT: Cập nhật payment
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { booking_id, amount, payment_method } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Payments SET booking_id = ${booking_id}, amount = ${amount}, payment_method = ${payment_method} WHERE id = ${id}`) ;
res.send('Cập nhật payment thành công');
} catch (err) {
console.error('Lỗi khi cập nhật payment:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔴 DELETE: Xoá payment
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Payments WHERE id = ${id}`) ;
res.send('Xoá payment thành công');
} catch (err) {
console.error('Lỗi khi xoá payment:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;