<template>
    <div class="poll">
      <h1 v-if="!voted">{{ poll.question }}</h1>
      <div v-if="!voted" class="choices">
        <button
          v-for="choice in poll.choices"
          :key="choice.text"
          @click="submitVote(choice.text)"
          class="choice-button">
          {{ choice.text }}
        </button>
      </div>
      <div v-if="voted">
        <h2>Predict which choice will get the most votes:</h2>
        <div class="choices predictions">
          <button
            v-for="choice in poll.choices"
            :key="choice.text"
            @click="submitPrediction(choice.text)"
            class="prediction-button">
            {{ choice.text }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'PollComponent',
    setup() {
      const poll = ref({ question: '', choices: [] });
      const voted = ref(false);
  
      const fetchPoll = async () => {
        try {
          const response = await axios.get('http://localhost:5656/polls/today');
          poll.value = response.data;
        } catch (error) {
          console.error('Failed to fetch poll:', error);
        }
      };
  
      const submitVote = async (choice) => {
        try {
          console.log(`Vote submitted: ${choice}`);
          const response = await axios.post('http://localhost:5656/vote', {
            choice: choice,
            date: new Date().toISOString().split('T')[0]
          });
          console.log(response.data.message);  // Display a simple alert with the server response
          voted.value = true;  // Change state to show prediction options
        } catch (error) {
          console.error('Failed to submit vote:', error);
          alert('Failed to submit vote');
        }
      };
  
      const submitPrediction = async (choice) => {
        try {
          console.log(`Prediction submitted: ${choice}`);
          const response = await axios.post('http://localhost:5656/predict', {
            choice: choice,
            date: new Date().toISOString().split('T')[0]
          });
          console.log(response.data.message);  // Display a simple alert with the server response
          voted.value = false;  // Reset or navigate away
        } catch (error) {
          console.error('Failed to submit prediction:', error);
          alert('Failed to submit prediction');
        }
      };
  
      onMounted(fetchPoll);
  
      return { poll, voted, submitVote, submitPrediction };
    }
  };
  </script>
  
  <style scoped>
  .poll {
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 44px;
  }
  
  .choice-button {
    margin: 30px;
    padding: 300px 150px;
    border-radius: 50px;
    border: none;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 50%; /* Adjust based on total width for better mobile responsiveness */
  }

  .prediction-button {
    margin: 20px;
    padding: 20px 60px;
    border-radius: 0px;
    border: none;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 20%; /* Adjust based on total width for better mobile responsiveness */
    transition: 0.4s ease-in;
  }

  .choices {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .predictions {
    display: flex;
    flex-direction: column; /* Stack buttons vertically */
    align-items: center;
  }

  .prediction-button:hover {
    background: #f2ff80;
    box-shadow: 0 0 5px #f2ff80, 0 0 25px #f2ff80, 0 0 50px #f2ff80, 0 0 200px #f2ff80;
  }
  </style>
  