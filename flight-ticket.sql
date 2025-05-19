USE Flight_Ticket

/*USERS*/
CREATE TABLE Users (
	user_id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone_number VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

/*ADMINS*/
CREATE TABLE Admins (
	admin_id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE,
    password NVARCHAR(255),
    role NVARCHAR(20) CHECK (role IN ('Manager', 'Staff'))
)

/*Airports */
CREATE TABLE Airports (
    airport_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100),
    code NVARCHAR(10) UNIQUE,
    location NVARCHAR(255)
);

-- AIRPLANES
CREATE TABLE Airplanes (
    airplane_id INT PRIMARY KEY IDENTITY(1,1),
    model NVARCHAR(100),
    capacity INT
);

-- ROUTES
CREATE TABLE Routes (
    route_id INT PRIMARY KEY IDENTITY(1,1),
    from_airport INT,
    to_airport INT,
    distance_km INT,
    FOREIGN KEY (from_airport) REFERENCES Airports(airport_id),
    FOREIGN KEY (to_airport) REFERENCES Airports(airport_id)
);

-- FLIGHTS
CREATE TABLE Flights (
    flight_id INT PRIMARY KEY IDENTITY(1,1),
    airplane_id INT,
    route_id INT,
    departure_time DATETIME,
    arrival_time DATETIME,
    status NVARCHAR(20) CHECK (status IN ('On Time', 'Delayed', 'Cancelled')),
    FOREIGN KEY (airplane_id) REFERENCES Airplanes(airplane_id),
    FOREIGN KEY (route_id) REFERENCES Routes(route_id)
);

-- SEATS
CREATE TABLE Seats (
    seat_id INT PRIMARY KEY IDENTITY(1,1),
    airplane_id INT,
    seat_number NVARCHAR(10),
    class NVARCHAR(20) CHECK (class IN ('Economy', 'Business')),
    FOREIGN KEY (airplane_id) REFERENCES Airplanes(airplane_id)
);

-- BOOKINGS
CREATE TABLE Bookings (
    booking_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    flight_id INT,
    booking_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) CHECK (status IN ('Pending', 'Paid', 'Cancelled')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);

-- PAYMENTS
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    booking_id INT,
    amount DECIMAL(10,2),
    payment_method NVARCHAR(20) CHECK (payment_method IN ('VISA', 'Momo', 'ZaloPay', 'Cash')),
    payment_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);

-- TICKETS
CREATE TABLE Tickets (
    ticket_id INT PRIMARY KEY IDENTITY(1,1),
    booking_id INT,
    seat_id INT,
    price DECIMAL(10,2),
    ticket_type NVARCHAR(20) CHECK (ticket_type IN ('Economy', 'Business')),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (seat_id) REFERENCES Seats(seat_id)
);

INSERT INTO Users (name, email, password, phone_number)
VALUES 
(N'Nguyễn Văn A', 'vana@gmail.com', '123456', '0909123456'),
(N'Trần Thị B', 'thib@gmail.com', 'abcdef', '0911222333');

INSERT INTO Admins (username, password, role)
VALUES 
('admin1', 'adminpass', 'Manager'),
('staff1', 'staffpass', 'Staff');

INSERT INTO Airports (name, code, location)
VALUES 
(N'Tân Sơn Nhất', 'SGN', N'Hồ Chí Minh'),
(N'Nội Bài', 'HAN', N'Hà Nội');

INSERT INTO Airplanes (model, capacity)
VALUES 
('Airbus A320', 180),
('Boeing 737', 160);

INSERT INTO Routes (from_airport, to_airport, distance_km)
VALUES 
(1, 2, 1160);  -- SGN -> HAN

INSERT INTO Flights (airplane_id, route_id, departure_time, arrival_time, status)
VALUES 
(1, 1, '2025-06-01 08:00:00', '2025-06-01 10:10:00', 'On Time');

INSERT INTO Seats (airplane_id, seat_number, class)
VALUES 
(1, 'A1', 'Economy'),
(1, 'B1', 'Business');

INSERT INTO Bookings (user_id, flight_id, status)
VALUES 
(1, 1, 'Paid');

INSERT INTO Payments (booking_id, amount, payment_method)
VALUES 
(1, 1500000, 'VISA');

INSERT INTO Tickets (booking_id, seat_id, price, ticket_type)
VALUES 
(1, 1, 1500000, 'Economy');
