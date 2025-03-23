const os = require('os');
const osu = require('os-utils');
const axios = require('axios');

const THRESHOLD = 75; // CPU & RAM usage threshold
const CHECK_INTERVAL = 2000; // Check every 10 sec

async function checkSystemUsage() {
    osu.cpuUsage(async (cpu) => {
        const memoryUsage = (1 - os.freemem() / os.totalmem()) * 100;

        console.log(`CPU Usage: ${cpu * 100}%`);
        console.log(`Memory Usage: ${memoryUsage}%`);

        if (cpu * 100 > THRESHOLD || memoryUsage > THRESHOLD) {
            console.log('High resource usage detected! Triggering GCP auto-scale...');
            await triggerGCPInstance();
        }
    });
}

async function triggerGCPInstance() {
    try {
        await axios.post('https://us-central1-reference-node-451306-f5.cloudfunctions.net/scaleUp', {
            action: 'scale_up'
        });
        console.log('GCP instance creation request sent.');
    } catch (error) {
        console.error('Failed to trigger GCP:', error.message);
    }
}

setInterval(checkSystemUsage, CHECK_INTERVAL);
