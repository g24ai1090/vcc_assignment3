const { Compute } = require('@google-cloud/compute');

exports.scaleUp = async (req, res) => {
    const compute = new Compute();
    const zone = compute.zone('us-central1-a');
    const vmName = `scaled-instance-${Date.now()}`;

    try {
        const vm = zone.vm(vmName);
        await vm.create({ machineType: 'e2-medium', image: 'debian-11' });

        res.status(200).send({ message: `VM ${vmName} created successfully.` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
