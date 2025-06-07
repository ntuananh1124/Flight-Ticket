// File: routes/users.js

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

// GET /users/paginate?page=1&pageSize=10
router.get('/paginate', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    try {
        await sql.connect(dbConfig);
        const totalResult = await sql.query('SELECT COUNT(*) as total FROM Users');
        const total = totalResult.recordset[0].total;

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

// GET /users/check?email=abc@xyz.com&password=123456
router.get('/check', async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password parameter' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        request.input('email', sql.VarChar(100), email);
        request.input('password', sql.VarChar(255), password);

        const result = await request.query('SELECT user_id, name, email, phone_number FROM Users WHERE email = @email AND password = @password');

        if (result.recordset.length > 0) {
            return res.json({ exists: true, user: result.recordset[0] });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error('Error querying DB:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /users/:user_id
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`
                SELECT name, email, phone_number, password
                FROM Users
                WHERE user_id = @user_id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// CREATE new user
router.post('/', async (req, res) => {
    const { name, email, password, phone_number } = req.body;
    try {
        await sql.connect(dbConfig);
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        // Check if email already exists
        request.input('email', sql.VarChar(100), email);
        const checkResult = await request.query('SELECT user_id FROM Users WHERE email = @email');

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Insert new user
        request.input('name', sql.NVarChar, name);
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
router.put('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { name, email, password, phone_number } = req.body;
    try {
        const pool = await sql.connect(dbConfig);

        await pool.request()
            .input('name', sql.NVarChar(100), name)
            .input('email', sql.NVarChar(100), email)
            .input('password', sql.NVarChar(255), password)
            .input('phone_number', sql.NVarChar(15), phone_number)
            .input('user_id', sql.Int, user_id)
            .query(`
                UPDATE Users
                SET name = @name,
                    email = @email,
                    password = @password,
                    phone_number = @phone_number
                WHERE user_id = @user_id
            `);
        res.send('Cập nhật người dùng thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi cập nhật người dùng');
    }
});

// DELETE user
router.delete('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        await sql.connect(dbConfig);
        await sql.query(`DELETE FROM Users WHERE user_id = ${user_id}`);
        res.send('Xóa người dùng thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi xoá người dùng');
    }
});

module.exports = router;