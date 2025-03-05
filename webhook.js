const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const SECRET = "prophone2025"; // Replace with a random string

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const sig = `sha256=${crypto.createHmac('sha256', SECRET).update(JSON.stringify(req.body)).digest('hex')}`;

    if (req.headers['x-hub-signature-256'] !== sig) {
        return res.status(401).send('Invalid signature');
    }

    exec('/var/www/stage/deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Webhook execution failed');
        }
        console.log(`Success: ${stdout}`);
        res.send('Webhook executed successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Listening for GitHub webhooks on port ${PORT}`);
});
