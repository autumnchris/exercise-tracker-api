const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ExerciseSchema = new Schema({
  description: {
    type: String,
    required: [true, 'The exercise description must be included.']
  },
  duration: {
    type: Number,
    min: [0, 'The exercise duration cannot be less than 0.'],
    required: [true, 'The exercise duration must be included.']
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

// Virtual for the form input version of the exercise date
ExerciseSchema.virtual('dateInput').get(function() {
  return moment.utc(this.date).format('YYYY-MM-DD');
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;
