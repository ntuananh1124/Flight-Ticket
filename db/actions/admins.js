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
// PUT /api/admins/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).send('Vui lòng nhập đầy đủ thông tin');
    }

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('username', sql.NVarChar(50), username);
        request.input('password', sql.NVarChar(255), password);
        request.input('role', sql.NVarChar(20), role);
        request.input('admin_id', sql.Int, id);

        await request.query(`
            UPDATE Admins
            SET username = @username,
                password = @password,
                role = @role
            WHERE admin_id = @admin_id
        `);

        res.send('Cập nhật Admin thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi cập nhật Admin');
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

// GET /admins/check?username=admin1&password=adminpass
router.get('/check', async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password parameter' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        request.input('username', sql.VarChar(100), username);
        request.input('password', sql.VarChar(255), password);

        const result = await request.query('SELECT admin_id, username, role FROM Admins WHERE username = @username AND password = @password');

        if (result.recordset.length > 0) {
            return res.json({ exists: true, admin: result.recordset[0] });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error('Error querying Admins:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;