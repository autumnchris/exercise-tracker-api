const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Exercise = require('./models/exercise.js');
const User = require('./models/user.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.use(express.static(`${__dirname}/public`));

app.post('/api/exercise/new-user', (req, res) => {
  const user = new User({
    username: req.body.newUser,
    log: [],
    count: 0
  });
  user.save().then(userData => {
    res.json({
      username: userData.username,
      _id: userData._id
    });
  }).catch(error => {
    res.json({ error });
  });
});

app.use((req, res) => {
  res.sendFile(`${__dirname}/views/404.html`, 404);
});

app.listen(port, console.log(`Server is listening at port ${port}.`));
