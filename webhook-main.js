import express from 'express';
import { exec } from 'child_process';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const app = express();
const PORT = 4001;
const SECRET = "dashboardmain"; // Use a different secret for main

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const sig = `sha256=${crypto.createHmac('sha256', SECRET).update(JSON.stringify(req.body)).digest('hex')}`;
    if (req.headers['x-hub-signature-256'] !== sig) {
        return res.status(401).send('Invalid signature');
    }

    console.log("Received push to 'Main' branch. Deploying Main...");
    exec('/var/www/main/deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Main deployment failed');
        }
        console.log(`Main Deployment Success: ${stdout}`);
        res.send('Main deployment completed');
    });
});

app.listen(PORT, () => {
    console.log(`Listening for Main GitHub webhooks on port ${PORT}`);
});
