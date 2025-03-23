const { InstancesClient } = require('@google-cloud/compute');

exports.scaleUp = async (req, res) => {
    const projectId = 'reference-node-451306-f5';
    const zone = 'us-central1-a';
    const vmName = `scaled-instance-${Date.now()}`;

    try {
        console.log(`Creating VM: ${vmName}`);
        const instancesClient = new InstancesClient();

        // Define the VM configuration
        const instanceConfig = {
            name: vmName,
            machineType: `zones/${zone}/machineTypes/e2-medium`,
            disks: [{
                boot: true,
                autoDelete: true,
                initializeParams: {
                    sourceImage: 'projects/debian-cloud/global/images/debian-11'
                }
            }],
            networkInterfaces: [{ network: 'global/networks/default' }],
            metadata: {
                items: [{
                    key: 'startup-script',
                    value: `#!/bin/bash
                    sudo apt update -y
                    sudo apt install -y git nodejs npm
                    git clone https://github.com/g24ai1090/vcc_assignment3.git /home/customerAPI
                    cd /home/customerAPI
                    npm install
                    nohup node server.js > output.log 2>&1 &`
                }]
            }
        };

        // Create the VM instance
        const [operation] = await instancesClient.insert({
            project: projectId,
            zone,
            instanceResource: instanceConfig,
        });

        // Wait for the operation to complete
        await operation.promise();
        console.log(`VM ${vmName} created successfully.`);

        res.status(200).send({ message: `VM ${vmName} created successfully.` });
    } catch (error) {
        console.error('Error creating VM:', error.message);
        res.status(500).send({ error: error.message });
    }
};
