const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 🟢 GET: Lấy danh sách hành khách
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Passengers');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách hành khách:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🟡 POST: Thêm hành khách mới
router.post('/', async (req, res) => {
const { booking_id, full_name, email, phone_number, date_of_birth, nationality, identity_number } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Passengers (booking_id, full_name, email, phone_number, date_of_birth, nationality, identity_number) VALUES (${booking_id}, ${full_name}, ${email}, ${phone_number}, ${date_of_birth}, ${nationality}, ${identity_number})`) ;
res.status(201).send('Thêm hành khách thành công');
} catch (err) {
console.error('Lỗi khi thêm hành khách:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔵 PUT: Cập nhật thông tin hành khách
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { booking_id, full_name, email, phone_number, date_of_birth, nationality, identity_number } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Passengers SET booking_id = ${booking_id}, full_name = ${full_name}, email = ${email}, phone_number = ${phone_number}, date_of_birth = ${date_of_birth}, nationality = ${nationality}, identity_number = ${identity_number} WHERE id = ${id}`) ;
res.send('Cập nhật hành khách thành công');
} catch (err) {
console.error('Lỗi khi cập nhật hành khách:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔴 DELETE: Xoá hành khách
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Passengers WHERE id = ${id}`);
res.send('Xoá hành khách thành công');
} catch (err) {
console.error('Lỗi khi xoá hành khách:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;