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

const suggestionSchema = new Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if you track users
  question: { type: String, required: true },
  choices: [{ type: String }], // Array of possible answer choices
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

//add an index to the 'date' field to improve query performance
pollSchema.index({ date: 1 });

//compile schema into a model
const Poll = mongoose.model('Poll', pollSchema);
const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = { Poll, Suggestion };
