const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📄 GET: Lấy tất cả ghế của các chuyến bay
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM FlightSeats');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách FlightSeats:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Tạo ghế chuyến bay mới
router.post('/', async (req, res) => {
const { flight_id, seat_id, is_booked } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO FlightSeats (flight_id, seat_id, is_booked) VALUES (${flight_id}, ${seat_id}, ${is_booked})`) ;
res.status(201).send('Thêm ghế chuyến bay thành công');
} catch (err) {
console.error('Lỗi khi thêm FlightSeat:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ✏️ PUT: Cập nhật trạng thái ghế chuyến bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { flight_id, seat_id, is_booked } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE FlightSeats SET flight_id = ${flight_id}, seat_id = ${seat_id}, is_booked = ${is_booked} WHERE id = ${id}`) ;
res.send('Cập nhật FlightSeat thành công');
} catch (err) {
console.error('Lỗi khi cập nhật FlightSeat:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá ghế chuyến bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM FlightSeats WHERE id = ${id}`);
res.send('Xoá FlightSeat thành công');
} catch (err) {
console.error('Lỗi khi xoá FlightSeat:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;