const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
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

app.post('/api/exercise/add', (req, res) => {
  let exercise;

  if (moment(req.body.date, 'YYYY-MM-DD', true).isValid() || req.body.date === '') {
    exercise = new Exercise({
      userId: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date || moment().format('YYYY-MM-DD')
    });
    exercise.save().then(exerciseData => {
      User.findByIdAndUpdate(req.body.userId, {$push: {log: exerciseData}, $inc: {count: 1}}).then(userData => {
        res.json({
          _id: userData._id,
          username: userData.username,
          exercise: {
            description: exerciseData.description,
            duration: exerciseData.duration,
            date: exerciseData.date
          }
        });
      }).catch(error => {
        res.json({ error });
      });
    }).catch(error => {
      res.json({ error });
    });
  }
  else {
    res.json({
      error: 'Invalid date. Please use YYYY-MM-DD format.'
    });
  }
});

app.get('/api/exercise/users', (req, res) => {
  User.find({}, '_id username').sort({username: 'asc'}).then(userData => {
    res.json(userData);
  }).catch(error => {
    res.json({ error });
  });
});

app.get('/api/exercise/log/:userid', (req, res) => {
  const limit = parseInt(req.query.limit);
  let from = req.query.from;
  let to = req.query.to;
  let log;

  if ((moment(from, 'YYYY-MM-DD', true).isValid() && moment(to, 'YYYY-MM-DD', true).isValid()) || !from && !to) {
    User.findById(req.params.userid, '_id username log count').populate({
      path: 'log',
      select: 'description duration date -_id',
      options: {
        sort: { date: 'desc' }
      }
    }).then(userData => {
      log = userData.log;

      if (from && to) {
        log = log.filter(exercise => moment(exercise.date).isBetween(from, to, null, []));
      }

      if (limit) {
        log = log.slice(0, limit);
      }

      log = log.reduce((acc, exercise) => {
        acc.push({
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toISOString().split('T')[0]
        });
        return acc;
      }, []);

      res.json({
        _id: userData._id,
        username: userData.username,
        log,
        count: userData.count
      });
    }).catch(error => {
      res.json({ error });
    });
  }
  else {
    res.json({
      error: 'Invalid date range.'
    });
  }
});

app.use((req, res) => {
  res.sendFile(`${__dirname}/views/404.html`, 404);
});

app.listen(port, console.log(`Server is listening at port ${port}.`));
