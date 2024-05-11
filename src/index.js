const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', route);
app.use('/', (req, res, next) => res.send('<h1>Hello f*king bot</h1>'));

let port = process.env.PORT || 5100;

app.listen(port, () => {
    console.log('App running at port: ' + port);
});
