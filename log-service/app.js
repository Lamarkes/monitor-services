const express = require('express');
const app = express();
app.use(express.json());
const pg = require('pg');

const { Pool } = pg

const pool = new Pool({
    user: "admin",
    host: "postgres",
    database: "mydb",
    password: "password",
});

const queryCreateTable = `CREATE TABLE IF NOT EXISTS saved_logs (
                            id SERIAL PRIMARY KEY,
                            service_name VARCHAR(100) NOT NULL,
                            message VARCHAR(100) NOT NULL,
                            route VARCHAR(100) NOT NULL,
                            method VARCHAR(30) NOT NULL,
                            hostname VARCHAR(100) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`

async function createTableFunction() {

    try {
        await pool.query(queryCreateTable);
    } catch (error) {
        console.log("Error to create table", error.stack)
    }
}

const queryInsertTable = `INSERT INTO saved_logs(service_name, message, route, method, hostname)
                            VALUES($1, $2, $3, $4, $5)`

async function insertTableFunction(query, values) {
    try {
        const res = await pool.query(query, values);
    } catch (error) {
        console.log("Error to insert table", error.stack);
    }
}

createTableFunction();
app.post('/log', (req, res) => {
    const values = [
        req.body.service,
        req.body.message,
        req.body.route,
        req.body.method,
        req.body.hostname
    ];
    insertTableFunction(queryInsertTable, values);

    res.json({ message: 'Log criado!' });
});

app.get('/logs', async (req, res) => {

    const response = await pool.query("SELECT * FROM saved_logs");

    res.json(response.rows);
});


const PORT = process.env.PORT || 3003;


app.listen(PORT, () => {
    console.log(`Running PORT: ${PORT}`);
})