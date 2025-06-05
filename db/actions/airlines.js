const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📥 GET: Lấy danh sách hãng hàng không
router.get('/', async (req, res) => {
try {
await sql.connect(dbConfig);
const result = await sql.query('SELECT * FROM Airlines');
res.json(result.recordset);
} catch (err) {
console.error('Lỗi khi lấy danh sách airlines:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ➕ POST: Thêm hãng hàng không
router.post('/', async (req, res) => {
const { name, image, description } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`INSERT INTO Airlines (name, image, description) VALUES (${name}, ${image}, ${description})`) ;
res.status(201).send('Thêm hãng hàng không thành công');
} catch (err) {
console.error('Lỗi khi thêm airlines:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// 🔄 PUT: Cập nhật hãng hàng không
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { name, image, description } = req.body;
try {
await sql.connect(dbConfig);
await sql.query(`UPDATE Airlines SET name = ${name}, image = ${image}, description = ${description} WHERE airline_id = ${id}`) ;
res.send('Cập nhật hãng hàng không thành công');
} catch (err) {
console.error('Lỗi khi cập nhật airlines:', err);
res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá hãng hàng không
router.delete('/:id', async (req, res) => {
const { id } = req.params;
try {
await sql.connect(dbConfig);
await sql.query(`DELETE FROM Airlines WHERE airline_id = ${id}`) ;
res.send('Xoá hãng hàng không thành công');
} catch (err) {
console.error('Lỗi khi xoá airlines:', err);
res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;