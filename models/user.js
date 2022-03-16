const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'A username must be included.'],
    maxLength: [35, 'The username must only contain a combination of letters and numbers.'],
    unique: true
  },
  log: [{
    type: Schema.Types.ObjectId,
    ref: 'Exercise'
  }],
  count: {
    type: Number,
    min: [0, 'The exercise count cannot be less than 0.'],
    required: [true, 'The exercise count must be included.']
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
