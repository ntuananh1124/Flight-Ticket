const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8');
const { dbConfig } = require('../dbConfig');

// 🟢 GET: Lấy tất cả giá chuyến bay (có thể filter theo flight_id)
router.get('/', async (req, res) => {
    const { flight_id } = req.query;

    try {
        await sql.connect(dbConfig);
        let result;

        if (flight_id) {
            const request = new sql.Request();
            request.input('flight_id', sql.Int, flight_id);

            result = await request.query(`
                SELECT * FROM FlightPrices
                WHERE flight_id = @flight_id
            `);
        } else {
            result = await sql.query('SELECT * FROM FlightPrices');
        }

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
        const request = new sql.Request();
        request.input('flight_id', sql.Int, flight_id);
        request.input('class', sql.NVarChar(50), seatClass);
        request.input('price', sql.Float, price);

        await request.query(`
            INSERT INTO FlightPrices (flight_id, class, price)
            VALUES (@flight_id, @class, @price)
        `);

        res.status(201).send('Thêm giá thành công');
    } catch (err) {
        console.error('Lỗi khi thêm giá chuyến bay:', err);
        res.status(500).send('Lỗi máy chủ');
    }
});

// 🔵 PUT: Cập nhật giá cho chuyến bay
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('price', sql.Float, price);
        request.input('id', sql.Int, id);

        await request.query(`
            UPDATE FlightPrices
            SET price = @price
            WHERE id = @id
        `);

        res.send('Cập nhật giá thành công');
    } catch (err) {
        console.error('Lỗi khi cập nhật giá chuyến bay:', err);
        res.status(500).send('Lỗi máy chủ');
    }
});

// 🟠 DELETE: Xoá toàn bộ giá chuyến bay theo flight_id
router.delete('/by-flight/:flight_id', async (req, res) => {
    const { flight_id } = req.params;

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('flight_id', sql.Int, flight_id);

        const result = await request.query(`
            DELETE FROM FlightPrices
            WHERE flight_id = @flight_id
        `);

        res.send('Đã xoá toàn bộ giá vé của chuyến bay');
    } catch (err) {
        console.error('Lỗi khi xoá giá vé theo chuyến bay:', err);
        res.status(500).send('Lỗi máy chủ');
    }
});


module.exports = router;
