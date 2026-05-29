const express = require('express');
const app = express();
app.use(express.json());
const logs = []


app.post('/log', (req, res) => {

    logs.push(req.body);

    res.json({message:'Log criado!'});
});

app.get('/logs', (req, res) => {
    res.json(logs);
});


const PORT = process.env.PORT || 3003;


app.listen(PORT, ()=>{
     console.log(`Running PORT: ${PORT}`);
})