const express = require('express');

const app = express();

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Home Route');
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

const pieces = require('./pieces');

app.get('/pieces', (req, res) => {
  res.json(pieces);
});

console.log(pieces);