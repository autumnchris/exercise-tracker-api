const validator = require('validator');
const User = require('../models/user');
const Exercise = require('../models/exercise');

exports.addExercise = (req, res, next) => {
  function validateForm(formData, date, userID) {

    if (!userID) {
      return 'A registered user ID must be included.';
    }
    if (!formData.description) {
      return 'The exercise description must be included.';
    }
    else if (!formData.duration) {
      return 'The exercise duration must be included.';
    }
    else if (isNaN(formData.duration)) {
      return 'The exercise duration must be a number.';
    }
    else if (formData.duration < 0) {
      return 'The exercise duration cannot be less than 0.';
    }
    else if (formData.date && !validator.isDate(date, { format: 'YYYY-MM-DD', strictMode: true })) {
      return 'The date is not in a recognized format.';
    }
    else {
      return null;
    }
  }

  const exercise = new Exercise({
    description: req.body.description.trim(),
    duration: req.body.duration.trim(),
    date: req.body.date.trim()
  });

  if (validateForm(exercise, req.body.date.trim(), req.body.userID.trim())) {
    res.render('exercise-form', { data: { userID: req.body.userID.trim(), exercise }, errorMessage: validateForm(exercise, req.body.date.trim(), req.body.userID.trim()) });
  }
  else {
    User.findById(req.body.userID).then(data => {
      exercise.save().then(exerciseData => {
        User.findByIdAndUpdate(req.body.userID, {
          $push: {
            log: exerciseData
          }, $inc: {
            count: 1
          }
        }).then(userData => {
          res.json({
            userID: userData._id,
            username: userData.username,
            newExercise: {
              description: exerciseData.description,
              duration: exerciseData.duration,
              date: exerciseData.dateInput
            }
          });
        }).catch(err => {
          res.render('exercise-form', { data: { userID: req.body.userID.trim(), exercise }, errorMessage: 'Unable to add new exercise to this user at this time.' });
        });
      }).catch(err => {
        res.render('exercise-form', { data: { userID: req.body.userID.trim(), exercise }, errorMessage: 'Unable to add new exercise to this user at this time.' });
      });
    }).catch(err => {
      res.render('exercise-form', { data: { userID: req.body.userID.trim(), exercise }, errorMessage: 'Unable to recognize this user ID in the database.' });
    });
  }
};
