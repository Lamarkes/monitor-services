const express = require('express');
const app = express();
process.env.TZ = 'America/Sao_Paulo';

const hostname = process.env.HOSTNAME || "container-1";

app.get("/", (req, res) => {
    res.send("<h1> Hello from Status Server</h1>")
});

app.get("/status", (req, res) => {
    const date_time = new Date();
    const uptime = Math.floor(process.uptime());

    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;


    res.json({
        "status": "Online",
        "uptime": `${hours} hrs:${minutes} min:${seconds} sec`,
        "hostname": hostname
    });
    sendLogs();
});

app.get('/health', (req, res)=>{

    res.json({
        "service": "status-service",
        "status": "UP"
    })
});


async function sendLogs() {

    const response = { 
        'service': 'status-service', 
        "message": "GET /status executado",
        "route": "/status",
        "method": "GET",
        "hostname": hostname
    
    }
    try {
        const resposta = await fetch('http://logservice:3003/log', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(response)
        });
    } catch (erro){
        console.error('Ocorreu um erro:', erro);
    }
    
}

const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})
