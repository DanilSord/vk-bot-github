const express = require('express');
const bodyParser = require('body-parser');
const { PORT, CONFIRMATION } = require('./config/config.js');
const app = express();
const setRoutes = require('./routes/routes.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
setRoutes(app);

app.get('*', (req, res) => {
  res.send('Hello from VkBot by DanilSord');
});

app.post('/', (req, res) => {
  const { body } = req;
  switch (body.type) {
    case 'confirmation':
      res.end(CONFIRMATION);
      break;

    case 'message_new':
      console.log(body);
      res.end('ok');
      break;

    default:
      res.end('ok');
      break;
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));