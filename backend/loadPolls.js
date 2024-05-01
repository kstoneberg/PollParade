const mongoose = require('mongoose');
const fs = require('fs');
const Poll = require('./models/Poll');
const dbUri = 'mongodb://localhost:27017/pollApp';

mongoose.connect(dbUri)
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

const loadPolls = async () => {
    try {
        const data = fs.readFileSync('polls.json', 'utf8');
        const polls = JSON.parse(data);

        for (let pollData of polls) {
            const { date, question, choices } = pollData;
            const choicesFormatted = choices.map(choice => ({ text: choice, votes: 0, predictions: 0 }));
            const newPoll = new Poll({ date, question, choices: choicesFormatted });
            try {
                await newPoll.save();
                console.log(`Poll for date ${date} added successfully.`);
            } catch (error) {
                if (error.code === 11000) { //duplicate key error code
                    console.log(`Duplicate found. Skipping poll for date ${date}.`);
                } else {
                    console.error(`Error adding poll for date ${date}:`, error);
                }
            }
        }

        console.log('Finished loading polls.');
    } catch (error) {
        console.error('Failed to load polls:', error);
    } finally {
        mongoose.disconnect();
    }
};

loadPolls();
