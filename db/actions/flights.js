const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📥 GET: Lấy danh sách tất cả chuyến bay
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Flights');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách Flights:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Thêm chuyến bay mới
router.post('/', async (req, res) => {
const { airplane_id, route_id, departure_time, arrival_time, status, airline_id } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Flights (airplane_id, route_id, departure_time, arrival_time, status, airline_id) VALUES (${airplane_id}, ${route_id}, ${departure_time}, ${arrival_time}, ${status}, ${airline_id})`) ;
res.status(201).send('Thêm chuyến bay thành công');
} catch (err) {
console.error('Lỗi khi thêm chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔄 PUT: Cập nhật chuyến bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { airplane_id, route_id, departure_time, arrival_time, status, airline_id } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Flights SET airplane_id = ${airplane_id}, route_id = ${route_id}, departure_time = ${departure_time}, arrival_time = ${arrival_time}, status = ${status}, airline_id = ${airline_id} WHERE flight_id = ${id}`) ;
res.send('Cập nhật chuyến bay thành công');
} catch (err) {
console.error('Lỗi khi cập nhật chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá chuyến bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Flights WHERE flight_id = ${id}`) ;
res.send('Xoá chuyến bay thành công');
} catch (err) {
console.error('Lỗi khi xoá chuyến bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;