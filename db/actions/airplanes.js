const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig'); // đường dẫn đến cấu hình DB

// 📥 GET: Lấy danh sách máy bay
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Airplanes');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách máy bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Thêm máy bay
router.post('/', async (req, res) => {
const { model, capacity } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Airplanes (model, capacity) VALUES (${model}, ${capacity})`) ;
res.status(201).send('Thêm máy bay thành công');
} catch (err) {
console.error('Lỗi khi thêm máy bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔄 PUT: Cập nhật máy bay
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { model, capacity } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Airplanes SET model = ${model}, capacity = ${capacity} WHERE airplane_id = ${id}`) ;
res.send('Cập nhật máy bay thành công');
} catch (err) {
console.error('Lỗi khi cập nhật máy bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá máy bay
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Airplanes WHERE airplane_id = ${id}`);
res.send('Xoá máy bay thành công');
} catch (err) {
console.error('Lỗi khi xoá máy bay:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;