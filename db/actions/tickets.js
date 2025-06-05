const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📄 GET: Lấy danh sách tất cả vé
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Tickets');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách vé:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Tạo vé mới
router.post('/', async (req, res) => {
const { booking_id, seat_id, price, ticket_type } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Tickets (booking_id, seat_id, price, ticket_type) VALUES (${booking_id}, ${seat_id}, ${price}, ${ticket_type})`) ;
res.status(201).send('Tạo vé thành công');
} catch (err) {
console.error('Lỗi khi tạo vé:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ✏️ PUT: Cập nhật thông tin vé
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { booking_id, seat_id, price, ticket_type } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Tickets SET booking_id = ${booking_id}, seat_id = ${seat_id}, price = ${price}, ticket_type = ${ticket_type} WHERE id = ${id}`) ;
res.send('Cập nhật vé thành công');
} catch (err) {
console.error('Lỗi khi cập nhật vé:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá vé
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Tickets WHERE id = ${id}`);
res.send('Xoá vé thành công');
} catch (err) {
console.error('Lỗi khi xoá vé:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;