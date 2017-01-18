const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.sendFile("build/example.html", {"root": __dirname});
});

app.listen(2020);
