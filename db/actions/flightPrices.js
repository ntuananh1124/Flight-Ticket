const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 🟢 GET: Lấy tất cả giá chuyến bay
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM FlightPrices');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy giá chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🟡 POST: Thêm giá mới cho chuyến bay
router.post('/', async (req, res) => {
const { flight_id, class: seatClass, price } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO FlightPrices (flight_id, class, price) VALUES (${flight_id}, ${seatClass}, ${price})`) ;
res.status(201).send('Thêm giá thành công');
} catch (err) {
console.error('Lỗi khi thêm giá chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔵 PUT: Cập nhật giá cho chuyến bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { flight_id, class: seatClass, price } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE FlightPrices SET flight_id = ${flight_id}, class = ${seatClass}, price = ${price} WHERE id = ${id}`) ;
res.send('Cập nhật giá thành công');
} catch (err) {
console.error('Lỗi khi cập nhật giá chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔴 DELETE: Xoá giá chuyến bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM FlightPrices WHERE id = ${id}`) ;
res.send('Xoá giá thành công');
} catch (err) {
console.error('Lỗi khi xoá giá chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;