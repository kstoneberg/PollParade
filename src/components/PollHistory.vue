<template>
  <div>
    <button @click="$router.push('/')">Go to Poll</button>
    <h1 class="history-title">Poll History</h1>
    <div class="previous-polls">
      <button
        class="view-poll-result-button"
        v-for="poll in polls"
        :key="poll.date"
        @click="loadPollResults(poll.date)">
        {{ poll.date }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      polls: [], // Array to hold poll data
    };
  },
  created() {
    this.fetchPolls();
  },
  methods: {
    async fetchPolls() {
      try {
        const response = await axios.get('http://localhost:5656/polls');
        this.polls = response.data;
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      }
    },
    async loadPollResults(date) {
      try {
        const response = await axios.get(`http://localhost:5656/polls/results/${date}`);
        console.log(response.data); // Handle the poll results as needed
      } catch (error) {
        console.error('Failed to load poll results:', error);
      }
    }
  }
};
</script>

<style scoped>
.history-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
}

.history-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.previous-polls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.view-poll-result-button {
  margin: 5px 0;
  padding: 20px;
  width: 200px;
  align-content: center;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.view-poll-result-button:hover {
  background-color: #0056b3;
}
</style>