const os = require('os-utils');
const axios = require('axios');

// Threshold for CPU usage
const CPU_THRESHOLD = 75;

// GCP Instance details
const GCP_PROJECT_ID = 'your-gcp-project-id';
const GCP_ZONE = 'us-central1-a';
const INSTANCE_TEMPLATE = 'your-instance-template';

async function scaleToGCP() {
    try {
        await axios.post(`https://cloud.googleapis.com/compute/v1/projects/${GCP_PROJECT_ID}/zones/${GCP_ZONE}/instances`, {
            name: `vm-instance-${Date.now()}`,
            sourceInstanceTemplate: `projects/${GCP_PROJECT_ID}/global/instanceTemplates/${INSTANCE_TEMPLATE}`,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GCP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('New GCP instance created successfully!');
    } catch (error) {
        console.error('Error scaling instance:', error.response ? error.response.data : error.message);
    }
}

function monitorResources() {
    os.cpuUsage((cpuPercent) => {
        const memUsage = (1 - os.freememPercentage()) * 100;

        console.log(`CPU Usage: ${cpuPercent * 100}%`);
        console.log(`Memory Usage: ${memUsage}%`);

        if (cpuPercent * 100 > CPU_THRESHOLD || memUsage > CPU_THRESHOLD) {
            console.log('Resource usage exceeded 75%, scaling to GCP...');
            scaleToGCP();
        }
    });
}

// Monitor every 10 seconds
setInterval(monitorResources, 10000);
