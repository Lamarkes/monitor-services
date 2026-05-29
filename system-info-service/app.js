const express = require('express');
const os = require('os');
process.env.TZ = 'America/Sao_Paulo';

const app = express();
const plataform = os.platform();
const mem = Math.floor(os.totalmem() / 1048576);

const hostname = os.hostname();

app.get('/system', (req, res) => {
    const date_time = new Date();
    res.json({
        "plataform": plataform,
        "memory": mem + "MB",
        "hostname": hostname

    });
    sendLogs(date_time.toString());
});


async function sendLogs(date_time) {

    const response = {
        'service': 'system-info-service',
        "message": "GET /system executado",
        "route": "/system",
        'date': date_time,
        "method": "GET",
        "hostname": process.env.HOSTNAME

    }
    try {
        const resposta = await fetch('http://logservice:3003/log', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(response)
        });
    } catch (erro) {
        console.error('Ocorreu um erro:', erro);
    }

}

const PORT = process.env.PORT || 3002;


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
});