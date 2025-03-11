import express from 'express';
import { exec } from 'child_process';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const app = express();
const PORT = 4000;
const SECRET = "dashboardstage"; // Use a different secret for stage

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const sig = `sha256=${crypto.createHmac('sha256', SECRET).update(JSON.stringify(req.body)).digest('hex')}`;
    if (req.headers['x-hub-signature-256'] !== sig) {
        return res.status(401).send('Invalid signature');
    }

    console.log("Received push to 'Stage' branch. Deploying Stage...");
    exec('/var/www/stage/deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send('Stage deployment failed');
        }
        console.log(`Stage Deployment Success: ${stdout}`);
        res.send('Stage deployment completed');
    });
});

app.listen(PORT, () => {
    console.log(`Listening for Stage GitHub webhooks on port ${PORT}`);
});
