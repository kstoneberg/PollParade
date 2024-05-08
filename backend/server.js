const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const Poll = require('./models/Poll');
const app = express();
const port = 5656; 
const dbUri = 'mongodb://localhost:27017/pollApp';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));  

mongoose.connect(dbUri)
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

//get todays poll
app.get('/polls/today', async (req, res) => {
  const todayString = new Date().toISOString().split('T')[0]; //get today's date as a string
  try {
    const poll = await Poll.findOne({ date: todayString });
    if (poll) {
      res.json(poll);
    } else {
      res.status(404).json({
        message: 'No poll found for today.',
        dateQueried: todayString,
        info: `The server looked for a poll with the date ${todayString} and found none.`
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//submit a new vote
app.post('/vote', async (req, res) => {
  const { choice, date } = req.body;

  try {
    const poll = await Poll.findOne({ date: date });
    if (poll) {
      const choiceObj = poll.choices.find(c => c.text === choice);
      if (choiceObj) {
        choiceObj.votes += 1;
        await poll.save();
        res.json({ message: 'Vote recorded successfully' });
      } else {
        res.status(404).json({ message: 'Choice not found' });
      }
    } else {
      res.status(404).json({ message: 'No poll found for today' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//handle prediction
app.post('/predict', async (req, res) => {
  const { choice, date } = req.body;
  try {
      const poll = await Poll.findOne({ date: date });
      if (poll) {
          const choiceObj = poll.choices.find(c => c.text === choice);
          if (choiceObj) {
              choiceObj.predictions = (choiceObj.predictions || 0) + 1; // Increment predictions
              await poll.save();
              res.json({ message: 'Prediction recorded successfully' });
          } else {
              res.status(404).json({ message: 'Choice not found for prediction' });
          }
      } else {
          res.status(404).json({ message: 'Poll not found for prediction' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//get poll of given date
app.get('/polls/results/:date', async (req, res) => {
  const dateString = req.params.date;

  try {
    const poll = await Poll.findOne({ date: dateString });
    if (poll) {
      res.json(poll);
    } else {
      res.status(404).json({ message: 'No results found for this date' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
