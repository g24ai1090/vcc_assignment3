const { Compute } = require('@google-cloud/compute');

exports.scaleUp = async (req, res) => {
    const compute = new Compute();
    const zone = compute.zone('us-central1-a');
    const vmName = `scaled-instance-${Date.now()}`;

    try {
        console.log(`Creating VM: ${vmName}`);
        const vm = zone.vm(vmName);

        await vm.create({
            machineType: 'e2-medium',
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
        });

        res.status(200).send({ message: `VM ${vmName} created with customerAPI running.` });
    } catch (error) {
        console.error('Error creating VM:', error.message);
        res.status(500).send({ error: error.message });
    }
};
