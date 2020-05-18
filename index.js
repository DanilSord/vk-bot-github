const express = require('express');
const app = express();
const {PORT} = require('./config.js');

app.get('/', (req, res) => res.send('Hello world'));

app.listen(PORT, () => console.log(`Example listening on port ${PORT}`));