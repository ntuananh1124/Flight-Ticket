const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Không cần export sql/dbConfig nữa
const userRoutes = require('./actions/users');
const adminRoutes = require('./actions/admins');
const airportRoutes = require('./actions/airports');
const airplaneRoutes = require('./actions/airplanes');
const airlineRoutes = require('./actions/airlines');
const flightRouteRoutes = require('./actions/routes');
const flightRoutes = require('./actions/flights');
const seatRoutes = require('./actions/seats');
const flightPricesRoutes = require('./actions/flightPrices');
const bookingRoutes = require('./actions/bookings');
const paymentRoutes = require('./actions/payments');
const passengerRoutes = require('./actions/passengers');
const flightSeatRoutes = require('./actions/flightSeats');
const ticketRoutes = require('./actions/tickets');

// API chuyến bay (ví dụ)
// const { sql, dbConfig } = require('./dbConfig');
// app.get('/api/flights', async (req, res) => {
//     try {
//         await sql.connect(dbConfig);
//         const result = await sql.query('SELECT * FROM Flights');
//         res.json(result.recordset);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Lỗi kết nối CSDL");
//     }
// });

// Route người dùng
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/airplanes', airplaneRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/routes', flightRouteRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/flight-prices', flightPricesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/flight-seats', flightSeatRoutes);
app.use('/api/tickets', ticketRoutes);


// Khởi động
app.listen(5000, () => {
    console.log('API đang chạy tại http://localhost:5000');
});