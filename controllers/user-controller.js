const moment = require('moment');
const validator = require('validator');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  function validateForm(formData) {

    if (!formData.username) {
      return 'A username must be included.';
    }
    else if (!validator.isAlphanumeric(formData.username, 'en-US')) {
      return 'The username must only contain a combination of letters and numbers.';
    }
    else if (formData.username.length > 35) {
      return 'The username must be no more than 35 characters.';
    }
    else {
      return null;
    }
  }

  const user = new User({
    username: req.body.username.trim(),
    log: [],
    count: 0
  });

  if (validateForm(user)) {
    res.render('user-form', { data: user, errorMessage: validateForm(user) });
  }
  else {
    user.save().then(data => {
      res.json({
        username: data.username,
        _id: data._id
      });
    }).catch(err => {

      if (err.code === 11000) {
          res.render('user-form', { data: user, errorMessage: `The username, "${user.username}", already exists in the database.` });
      }
      else {
        res.send(err);
      }
    });
  }
}

exports.fetchUsers = (req, res, next) => {
  User.find({}, '_id username').sort({
    username: 'asc'
  }).then(data => {
    res.json({ data });
  }).catch(err => {
    res.send(err);
  });
}

exports.fetchUserLog = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  let from = req.query.from;
  let to = req.query.to;
  let log;

  if ((moment(from, 'YYYY-MM-DD', true).isValid() && moment(to, 'YYYY-MM-DD', true).isValid()) || !from && !to) {
    User.findById(req.params.userid).populate({
      path: 'log',
      options: {
        sort: { date: 'desc' }
      }
    }).then(data => {
      log = data.log;

      if (from && to) {
        log = log.filter(exercise => moment(exercise.date).isBetween(from, to, undefined, '[]'));
      }

      if (limit) {
        log = log.slice(0, limit);
      }

      log = log.reduce((acc, exercise) => {
        acc.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.dateInput
        });
        return acc;
      }, []);

      res.json({
        userID: data._id,
        username: data.username,
        log,
        count: data.count
      });
    }).catch(err => {
      res.send(err);
    });
  }
  else {
    res.send('The submitted date range is invalid.');
  }
}
