const express = require('express');

const app = express();
app.use(express.json());

let customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' }
];

let nextId = customers.length + 1;

app.get('/customers', (req, res) => {
    res.json(customers);
});

app.get('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
});

app.post('/customers', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
    }
    
    const newCustomer = { id: nextId++, name, email, phone };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});

app.put('/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const { name, email, phone } = req.body;
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;

    res.json(customer);
});

app.delete('/customers/:id', (req, res) => {
    const index = customers.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Customer not found' });

    customers.splice(index, 1);
    res.json({ message: 'Customer deleted' });
});


exports.customerAPI = app;
