const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json()); // json middleware

const users = [
    {id: 1, name: 'John',  age: 25},
    {id: 2, name: 'Alex',  age: 32},
    {id: 3, name: 'David', age: 44},
];

app.get('/',  (req, res) => {
    res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.post('/api/users', (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send({ 
        status: 400, 
        message: 'Bad Request', 
        details: error.details 
    });
    
    const user = {
        id: users.length + 1,
        name: req.body.name,
        age: req.body.age
    }

    users.push(user);
    res.send(user);
});

app.put('/api/users/:id', (req, res) => {
    // if not exist 404 not found
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) res.status(404).send({status: 404, message: 'Not Found'});

    // if invalid data 400 bad request
    const { error } = validate(req.body);

    if (error) return res.status(400).send({ 
        status: 400, 
        message: 'Bad Request',
        details: error.details 
    });

    // update and return the updated user
    user.name = req.body.name;
    user.age  = req.body.age;

    res.send(user);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (!user) res.status(404).send({
        status: 404, 
        message: 'Not Found' 
    });
    res.send(user);
});

app.delete('/api/users/:id', (req, res) => {
    // find the user
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send({
        status: 404, 
        message: 'Not Found' 
    });

    // delete
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(user);
});


function validate(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().required()
    });
    return schema.validate(data);
}

app.listen(3000);
