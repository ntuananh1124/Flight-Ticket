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
        request.input('departure_time', sql.DateTime, new Date(departure_time)); // rất quan trọng: convert sang Date
        request.input('arrival_time', sql.DateTime, new Date(arrival_time));
        request.input('status', sql.NVarChar(20), status);
        request.input('airline_id', sql.Int, airline_id);

        await request.query(`
            INSERT INTO Flights (airplane_id, route_id, departure_time, arrival_time, status, airline_id)
            VALUES (@airplane_id, @route_id, @departure_time, @arrival_time, @status, @airline_id)
        `);

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
        let whereClauses = [];
        let params = [];

        console.log("==== API /api/flights called ====");
        console.log("Query params:", req.query);

        if (route_id) {
            whereClauses.push("f.route_id = ?");
            params.push(route_id);
        } else {
            if (from) {
                const [fromRows] = await db.execute(
                    "SELECT airport_id FROM Airports WHERE code = ?",
                    [from]
                );
                const fromAirport = fromRows[0];

                if (!fromAirport) {
                    console.log("=> Không tìm thấy sân bay FROM → trả []");
                    return res.json([]);
                }

                whereClauses.push("r.from_airport = ?");
                params.push(fromAirport.airport_id);
            }

            if (to) {
                const [toRows] = await db.execute(
                    "SELECT airport_id FROM Airports WHERE code = ?",
                    [to]
                );
                const toAirport = toRows[0];

                if (!toAirport) {
                    console.log("=> Không tìm thấy sân bay TO → trả []");
                    return res.json([]);
                }

                whereClauses.push("r.to_airport = ?");
                params.push(toAirport.airport_id);
            }
        }

        if (start) {
            whereClauses.push("DATE(f.departure_time) = ?");
            params.push(start);
        }

        if (airline_id) {
            whereClauses.push("f.airline_id = ?");
            params.push(airline_id);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

        let query = `
            SELECT f.*, r.from_airport, r.to_airport
            FROM Flights f
            JOIN Routes r ON f.route_id = r.route_id
            ${whereSQL}
            ORDER BY f.departure_time ASC
        `;

        // Pagination
        if (limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(limit, 10));

            if (offset) {
                query += ` OFFSET ?`;
                params.push(parseInt(offset, 10));
            }
        }

        console.log("SQL Query:", query);
        console.log("SQL Params:", params);

        const [rows] = await db.execute(query, params);

        console.log("Rows returned:", rows.length);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;