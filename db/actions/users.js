const express = require('express');
const router = express.Router();
const { sql, dbConfig } = require('../dbConfig');

// GET all users
router.get('/', async (req, res) => {
try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM Users');
    res.json(result.recordset);
} catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy người dùng');
    }
});

// CREATE new user
router.post('/', async (req, res) => {
    const { name, email, password, phone_number } = req.body;
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('name', sql.NVarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);
        request.input('phone_number', sql.VarChar, phone_number);

        await request.query(`
            INSERT INTO Users (name, email, password, phone_number) 
            VALUES (@name, @email, @password, @phone_number)
        `);

        res.status(201).send('Thêm người dùng thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi thêm người dùng');
    }
});

// UPDATE user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, phone_number } = req.body;
    try {
        await sql.connect(dbConfig);
        await sql.query(`
            UPDATE Users
            SET name = '${name}', 
                email = '${email}', 
                password = '${password}', 
                phone_number = '${phone_number}'
            WHERE user_id = ${id}
        `);
        res.send('Cập nhật người dùng thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi cập nhật người dùng');
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
const { id } = req.params;
    try {
        await sql.connect(dbConfig);
        await sql.query(`DELETE FROM Users WHERE user_id = ${id}`);
        res.send('Xóa người dùng thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi xoá người dùng');
    }
});

// 📄 GET /api/users?page=1&pageSize=10
router.get('/', async (req, res) => {
const page = parseInt(req.query.page) || 1;
const pageSize = parseInt(req.query.pageSize) || 10;
const offset = (page - 1) * pageSize;

try {
    await sql.connect(dbConfig);
    // Tổng số bản ghi
    const totalResult = await sql.query('SELECT COUNT(*) as total FROM Users');
    const total = totalResult.recordset[0].total;

    // Lấy dữ liệu phân trang — dùng string thường thay vì sql.query`...`
    const result = await sql.query(`
        SELECT * FROM Users
        ORDER BY user_id
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
    `);

    res.json({
    data: result.recordset,
    pagination: {
        page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize)
    }
    });
    } catch (err) {
        console.error('Lỗi lấy danh sách users:', err);
        res.status(500).send('Lỗi máy chủ');
    }
});

module.exports = router;