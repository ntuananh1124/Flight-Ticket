const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 📄 GET all admins
router.get('/', async (req, res) => {
try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM Admins');
    res.json(result.recordset);
    } catch (err) {
    console.error('Lỗi khi lấy danh sách Admins:', err);
    res.status(500).send('Lỗi máy chủ');
    }
});

// ➕ POST: Tạo mới admin
router.post('/', async (req, res) => {
const { username, password, role, id } = req.body;
try {
    await sql.connect(dbConfig);
    await sql.query(`INSERT INTO Admins (username, password, role, id) VALUES (${username}, ${password}, ${role}, ${id})`) ;
    res.status(201).send('Admin đã được tạo');
} catch (err) {
    console.error('Lỗi khi tạo Admin:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

// 🛠️ PUT: Cập nhật thông tin admin
router.put('/:id', async (req, res) => {
const { username, password, role } = req.body;
const adminId = req.params.id;

try {
    await sql.connect(dbConfig);
    const result = await sql.query(`UPDATE Admins SET username = ${username}, password = ${password}, role = ${role} WHERE id = ${adminId}`) ;
if (result.rowsAffected[0] === 0) {
    return res.status(404).send('Không tìm thấy Admin');
}
    res.send('Đã cập nhật Admin');
} catch (err) {
    console.error('Lỗi khi cập nhật Admin:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

// ❌ DELETE: Xoá admin
router.delete('/:id', async (req, res) => {
const adminId = req.params.id;
try {
    await sql.connect(dbConfig);
    const result = await sql.query(`DELETE FROM Admins WHERE id = ${adminId}`) ;
    if (result.rowsAffected[0] === 0) {
        return res.status(404).send('Không tìm thấy Admin');
}
    res.send('Đã xoá Admin');
} catch (err) {
    console.error('Lỗi khi xoá Admin:', err);
    res.status(500).send('Lỗi máy chủ');
}
});

module.exports = router;