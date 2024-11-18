
import cors from 'cors';
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Replace with your MySQL username
    password: '',      // Replace with your MySQL password
    database: 'webbolt'  // Ensure this matches the name of your database
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL database');
    }
});

// GET /tablets - Retrieve all tablets
app.get('/tablets', (req, res) => {
    const query = 'SELECT * FROM Products';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});
app.get('/3legdraggab', (req, res) => {
    const query = 'SELECT * FROM `products` ORDER BY price DESC limit 3;';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});
app.get('/3legolcsobb', (req, res) => {
    const query = 'SELECT * FROM `products` ORDER BY price  limit 3;';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});
// GET /tablets/:id - Retrieve a specific tablet by id
app.get('/tablets/:id', (req, res) => {
    const tabletId = req.params.id;

    const query = 'SELECT * FROM Products WHERE product_id = ?';

    db.query(query, [tabletId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Tablet not found' });
        }
        res.json(results[0]);
    });
});
app.delete('/tablets/:id', (req, res) => {
    const tabletId = req.params.id;

    const query = 'DELETE FROM Products WHERE product_id = ?';

    db.query(query, [tabletId], (err, results) => {
        console.log(err)
        if (err) {
            return res.status(500).json({ error: 'Failed to delete tablet from database' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Tablet not found' });
        }
        res.json({ message: 'Tablet deleted successfully' });
    });
});
// POST /tablets - Add a new tablet
app.post('/tablets', (req, res) => {
    const tablet = req.body;

    const query = `
    INSERT INTO Products (
      name, description, operating_system, processor_clock_speed, processor_cores, 
      screen_size, screen_resolution, ram_size, year, color_options,price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const values = [
        tablet.name,
        tablet.description,
        tablet.operating_system,
        tablet.processor_clock_speed,
        tablet.processor_cores,
        tablet.screen_size,
        tablet.screen_resolution,
        tablet.ram_size,
        tablet.year,
        tablet.color_options,
        tablet.price
    ];

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to insert tablet into database' });
        }
        res.status(201).json({ message: 'Tablet added', product_id: results.insertId });
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
