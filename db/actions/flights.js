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
        const request = new sql.Request();

        request.input('airplane_id', sql.Int, airplane_id);
        request.input('route_id', sql.Int, route_id);
        request.input('departure_time', sql.DateTime, new Date(departure_time));
        request.input('arrival_time', sql.DateTime, new Date(arrival_time));
        request.input('status', sql.NVarChar(20), status);
        request.input('airline_id', sql.Int, airline_id);

        const result = await request.query(`
            INSERT INTO Flights (airplane_id, route_id, departure_time, arrival_time, status, airline_id)
            OUTPUT INSERTED.flight_id
            VALUES (@airplane_id, @route_id, @departure_time, @arrival_time, @status, @airline_id)
        `);

        const flight_id = result.recordset[0].flight_id;

        res.status(201).json({ flight_id }); // trả về flight_id cho FE dùng

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
        const request = new sql.Request();

        request.input('airplane_id', sql.Int, airplane_id);
        request.input('route_id', sql.Int, route_id);
        request.input('departure_time', sql.DateTime, new Date(departure_time));
        request.input('arrival_time', sql.DateTime, new Date(arrival_time));
        request.input('status', sql.NVarChar(20), status);
        request.input('airline_id', sql.Int, airline_id);
        request.input('flight_id', sql.Int, id);

        await request.query(`
            UPDATE Flights
            SET airplane_id = @airplane_id,
                route_id = @route_id,
                departure_time = @departure_time,
                arrival_time = @arrival_time,
                status = @status,
                airline_id = @airline_id
            WHERE flight_id = @flight_id
        `);

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

// Search Flight:
router.get("/", async (req, res) => {
    const { route_id, from, to, start, airline_id, limit, offset } = req.query;

    try {
        const pool = await sql.connect(dbConfig);

        let whereClauses = [];
        let request = pool.request();

        console.log("==== API /api/flights called ====");
        console.log("Query params:", req.query);

        // Nếu có route_id
        if (route_id) {
            whereClauses.push("f.route_id = @route_id");
            request.input("route_id", sql.Int, route_id);
        } else {
            // Nếu có from
            if (from) {
                const fromResult = await pool.request()
                    .input("fromCode", sql.VarChar, from)
                    .query("SELECT airport_id FROM Airports WHERE code = @fromCode");

                const fromAirport = fromResult.recordset[0];

                if (!fromAirport) {
                    console.log("=> Không tìm thấy sân bay FROM → trả []");
                    return res.json([]);
                }

                whereClauses.push("r.from_airport = @from_airport");
                request.input("from_airport", sql.Int, fromAirport.airport_id);
            }

            // Nếu có to
            if (to) {
                const toResult = await pool.request()
                    .input("toCode", sql.VarChar, to)
                    .query("SELECT airport_id FROM Airports WHERE code = @toCode");

                const toAirport = toResult.recordset[0];

                if (!toAirport) {
                    console.log("=> Không tìm thấy sân bay TO → trả []");
                    return res.json([]);
                }

                whereClauses.push("r.to_airport = @to_airport");
                request.input("to_airport", sql.Int, toAirport.airport_id);
            }
        }

        // Nếu có start date
        if (start) {
            whereClauses.push("CAST(f.departure_time AS DATE) = @startDate");
            request.input("startDate", sql.Date, start);
        }

        // Nếu có airline_id
        if (airline_id) {
            whereClauses.push("f.airline_id = @airline_id");
            request.input("airline_id", sql.Int, airline_id);
        }

        // Build WHERE final
        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // Build query
        let query = `
            SELECT f.*, r.from_airport, r.to_airport
            FROM Flights f
            JOIN Routes r ON f.route_id = r.route_id
            ${whereSQL}
            ORDER BY f.departure_time ASC
        `;

        // Pagination
        if (limit) {
            query += " OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";
            request.input("limit", sql.Int, parseInt(limit, 10));
            request.input("offset", sql.Int, parseInt(offset || 0, 10));
        }

        console.log("SQL Query:", query);

        const result = await request.query(query);

        console.log("Rows returned:", result.recordset.length);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;