const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'testdb',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL connected...');
  db.query('SELECT * FROM Users LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error querying Users table:', err);
    } else {
      console.log('Successfully connected to Users table');
    }
  });
});

app.post('/lots', (req, res) => {
  const { location, total_grids, slots_per_grid } = req.body;
  const query = 'INSERT INTO Lots (location, total_grids, slots_per_grid) VALUES (?, ?, ?)';
  db.query(query, [location, total_grids, slots_per_grid], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ lot_id: result.insertId, location, total_grids, slots_per_grid });
  });
});

app.get('/lots', (req, res) => {
  db.query('SELECT * FROM Lots', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/lots/:lot_id', (req, res) => {
  const { lot_id } = req.params;
  const { location, total_grids, slots_per_grid } = req.body;
  db.query(
    'UPDATE Lots SET location = ?, total_grids = ?, slots_per_grid = ? WHERE lot_id = ?',
    [location, total_grids, slots_per_grid, lot_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Lot updated' });
    }
  );
});

app.delete('/lots/:lot_id', (req, res) => {
  const { lot_id } = req.params;
  db.query('DELETE FROM Lots WHERE lot_id = ?', [lot_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Lot deleted' });
  });
});

app.post('/users', (req, res) => {
  const { cname, cphone, cphone_alt } = req.body;
  const query = 'INSERT INTO Users (cname, cphone, cphone_alt) VALUES (?, ?, ?)';
  db.query(query, [cname, cphone, cphone_alt], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ user_id: result.insertId, cname, cphone, cphone_alt });
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  const { cname, cphone, cphone_alt } = req.body;
  db.query(
    'UPDATE Users SET cname = ?, cphone = ?, cphone_alt = ? WHERE user_id = ?',
    [cname, cphone, cphone_alt, user_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User updated' });
    }
  );
});

app.delete('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.query('DELETE FROM Users WHERE user_id = ?', [user_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User deleted' });
  });
});

// Employee endpoints
app.post('/employees', (req, res) => {
  const { lot_id, shift_time, supervisor_id, attendants_supervising, role, ename, ephone, ephone_alt } = req.body;
  const query = 'INSERT INTO Employee (lot_id, shift_time, supervisor_id, attendants_supervising, role, ename, ephone, ephone_alt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [lot_id, shift_time || null, supervisor_id || null, attendants_supervising || null, role, ename, ephone, ephone_alt || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ emp_id: result.insertId, lot_id, shift_time, supervisor_id, attendants_supervising, role, ename, ephone, ephone_alt });
  });
});

app.get('/employees', (req, res) => {
  db.query('SELECT * FROM Employee', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/employees/:emp_id', (req, res) => {
  const { emp_id } = req.params;
  const { lot_id, shift_time, supervisor_id, attendants_supervising, role, ename, ephone, ephone_alt } = req.body;
  db.query(
    'UPDATE Employee SET lot_id = ?, shift_time = ?, supervisor_id = ?, attendants_supervising = ?, role = ?, ename = ?, ephone = ?, ephone_alt = ? WHERE emp_id = ?',
    [lot_id, shift_time || null, supervisor_id || null, attendants_supervising || null, role, ename, ephone, ephone_alt || null, emp_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Employee updated' });
    }
  );
});

app.delete('/employees/:emp_id', (req, res) => {
  const { emp_id } = req.params;
  db.query('DELETE FROM Employee WHERE emp_id = ?', [emp_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Employee deleted' });
  });
});

// Grid endpoints
app.post('/grids', (req, res) => {
  const { lot_id, grid_number, attendant_id } = req.body;
  const query = 'INSERT INTO Grids (lot_id, grid_number, attendant_id) VALUES (?, ?, ?)';
  db.query(query, [lot_id, grid_number, attendant_id || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ grid_id: result.insertId, lot_id, grid_number, attendant_id });
  });
});

app.get('/grids', (req, res) => {
  db.query('SELECT * FROM Grids', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/grids/:grid_id', (req, res) => {
  const { grid_id } = req.params;
  const { lot_id, grid_number, attendant_id } = req.body;
  db.query(
    'UPDATE Grids SET lot_id = ?, grid_number = ?, attendant_id = ? WHERE grid_id = ?',
    [lot_id, grid_number, attendant_id || null, grid_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Grid updated' });
    }
  );
});

app.delete('/grids/:grid_id', (req, res) => {
  const { grid_id } = req.params;
  db.query('DELETE FROM Grids WHERE grid_id = ?', [grid_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Grid deleted' });
  });
});

// Slot endpoints
app.post('/slots', (req, res) => {
  const { grid_id, slot_number, slot_code, vehicle_type, is_occupied } = req.body;
  const query = 'INSERT INTO Slots (grid_id, slot_number, slot_code, vehicle_type, is_occupied) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [grid_id, slot_number, slot_code, vehicle_type || null, is_occupied || false], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ slot_id: result.insertId, grid_id, slot_number, slot_code, vehicle_type, is_occupied });
  });
});

app.get('/slots', (req, res) => {
  db.query('SELECT * FROM Slots', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/slots/:slot_id', (req, res) => {
  const { slot_id } = req.params;
  const { grid_id, slot_number, slot_code, vehicle_type, is_occupied } = req.body;
  db.query(
    'UPDATE Slots SET grid_id = ?, slot_number = ?, slot_code = ?, vehicle_type = ?, is_occupied = ? WHERE slot_id = ?',
    [grid_id, slot_number, slot_code, vehicle_type || null, is_occupied !== undefined ? is_occupied : false, slot_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Slot updated' });
    }
  );
});

app.delete('/slots/:slot_id', (req, res) => {
  const { slot_id } = req.params;
  db.query('DELETE FROM Slots WHERE slot_id = ?', [slot_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Slot deleted' });
  });
});

// Rate endpoints
app.post('/rates', (req, res) => {
  const { hourly, daily, weekly, monthly_1, monthly_3, monthly_6, yearly } = req.body;
  const query = 'INSERT INTO Rates (hourly, daily, weekly, monthly_1, monthly_3, monthly_6, yearly) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [hourly || null, daily || null, weekly || null, monthly_1 || null, monthly_3 || null, monthly_6 || null, yearly || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ rate_id: result.insertId, hourly, daily, weekly, monthly_1, monthly_3, monthly_6, yearly });
  });
});

app.get('/rates', (req, res) => {
  db.query('SELECT * FROM Rates', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/rates/:rate_id', (req, res) => {
  const { rate_id } = req.params;
  const { hourly, daily, weekly, monthly_1, monthly_3, monthly_6, yearly } = req.body;
  db.query(
    'UPDATE Rates SET hourly = ?, daily = ?, weekly = ?, monthly_1 = ?, monthly_3 = ?, monthly_6 = ?, yearly = ? WHERE rate_id = ?',
    [hourly || null, daily || null, weekly || null, monthly_1 || null, monthly_3 || null, monthly_6 || null, yearly || null, rate_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Rate updated' });
    }
  );
});

app.delete('/rates/:rate_id', (req, res) => {
  const { rate_id } = req.params;
  db.query('DELETE FROM Rates WHERE rate_id = ?', [rate_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Rate deleted' });
  });
});

// Vehicle endpoints
app.post('/vehicles', (req, res) => {
  const { user_id, license_plate, vehicle_type } = req.body;
  const query = 'INSERT INTO Vehicles (user_id, license_plate, vehicle_type) VALUES (?, ?, ?)';
  db.query(query, [user_id, license_plate, vehicle_type], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ vehicle_id: result.insertId, user_id, license_plate, vehicle_type });
  });
});

app.get('/vehicles', (req, res) => {
  db.query('SELECT * FROM Vehicles', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/vehicles/:vehicle_id', (req, res) => {
  const { vehicle_id } = req.params;
  const { user_id, license_plate, vehicle_type } = req.body;
  db.query(
    'UPDATE Vehicles SET user_id = ?, license_plate = ?, vehicle_type = ? WHERE vehicle_id = ?',
    [user_id, license_plate, vehicle_type, vehicle_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Vehicle updated' });
    }
  );
});

app.delete('/vehicles/:vehicle_id', (req, res) => {
  const { vehicle_id } = req.params;
  db.query('DELETE FROM Vehicles WHERE vehicle_id = ?', [vehicle_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Vehicle deleted' });
  });
});

// Booking endpoints
app.post('/bookings', (req, res) => {
  const { slot_id, user_id, vehicle_id, start_time, end_time, duration, rate_id, total_amt } = req.body;
  const query = 'INSERT INTO Bookings (slot_id, user_id, vehicle_id, start_time, end_time, duration, rate_id, total_amt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [slot_id, user_id, vehicle_id, start_time, end_time, duration || null, rate_id || null, total_amt || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ booking_id: result.insertId, slot_id, user_id, vehicle_id, start_time, end_time, duration, rate_id, total_amt });
  });
});

app.get('/bookings', (req, res) => {
  db.query('SELECT * FROM Bookings', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/bookings/:booking_id', (req, res) => {
  const { booking_id } = req.params;
  const { slot_id, user_id, vehicle_id, start_time, end_time, duration, rate_id, total_amt } = req.body;
  db.query(
    'UPDATE Bookings SET slot_id = ?, user_id = ?, vehicle_id = ?, start_time = ?, end_time = ?, duration = ?, rate_id = ?, total_amt = ? WHERE booking_id = ?',
    [slot_id, user_id, vehicle_id, start_time, end_time, duration || null, rate_id || null, total_amt || null, booking_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Booking updated' });
    }
  );
});

app.delete('/bookings/:booking_id', (req, res) => {
  const { booking_id } = req.params;
  db.query('DELETE FROM Bookings WHERE booking_id = ?', [booking_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Booking deleted' });
  });
});

// Payment endpoints
app.post('/payments', (req, res) => {
  const { booking_id, p_date, p_time, p_amount, method, status } = req.body;
  const query = 'INSERT INTO Payments (booking_id, p_date, p_time, p_amount, method, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [booking_id, p_date, p_time, p_amount, method || null, status || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ payment_id: result.insertId, booking_id, p_date, p_time, p_amount, method, status });
  });
});

app.get('/payments', (req, res) => {
  db.query('SELECT * FROM Payments', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.put('/payments/:payment_id', (req, res) => {
  const { payment_id } = req.params;
  const { booking_id, p_date, p_time, p_amount, method, status } = req.body;
  db.query(
    'UPDATE Payments SET booking_id = ?, p_date = ?, p_time = ?, p_amount = ?, method = ?, status = ? WHERE payment_id = ?',
    [booking_id, p_date, p_time, p_amount, method || null, status || null, payment_id],
    err => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'Payment updated' });
    }
  );
});

app.delete('/payments/:payment_id', (req, res) => {
  const { payment_id } = req.params;
  db.query('DELETE FROM Payments WHERE payment_id = ?', [payment_id], err => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Payment deleted' });
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));