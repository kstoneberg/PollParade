const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  date: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  choices: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
    predictions: { type: Number, default: 0}
  }]
});

//add an index to the 'date' field to improve query performance
pollSchema.index({ date: 1 });

//compile schema into a model
const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
