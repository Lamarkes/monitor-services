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
                            message TEXT NOT NULL,
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

    return await pool.query(query, values);
    
}

app.post('/log', async (req, res) => {

    try {
        const values = [
            req.body.service,
            req.body.message,
            req.body.route,
            req.body.method,
            req.body.hostname
        ];


        const resp = await insertTableFunction(queryInsertTable, values);

        if (resp.rowCount > 0) {
            res.json({ message: 'Log criado!' });
        } else {
            res.status(500).json({ error: 'Erro ao inserir dados!' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir dados!' })
    }

});

app.get('/logs', async (req, res) => {

    const selectQuery = "SELECT * FROM saved_logs ORDER BY created_at DESC"
    const response = await pool.query(selectQuery);

    res.json(response.rows);
});


const PORT = process.env.PORT || 3003;

async function startServer() {
    await createTableFunction();

    app.listen(PORT, () => {
        console.log(`Running PORT: ${PORT}`);
    })
}
startServer();