<template>
  <v-app>
    <div>
      <v-btn @click="$router.push('/')" color="primary">Back</v-btn>
      <h1 class="manage-title">Manage Suggestions</h1>
      <div class="suggested-polls">
        <v-btn
          class="view-poll-suggestion-button"
          v-for="suggestion in suggestions"
          :key="suggestion.question"
          @click="loadEditSuggestion(suggestion.question)"
          color="success"
        >
          <strong>{{ suggestion.question }}</strong>
      </v-btn>
      </div>
    </div>
  </v-app>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        suggestions: [], // Array to hold poll data
      };
    },
    created() {
      this.fetchSuggestions();
    },
    methods: {
      async fetchSuggestions() {
        try {
          const response = await axios.get('http://localhost:5656/suggestions');
          console.log(response.data);
          this.suggestions = response.data;
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      },
      async loadEditSuggestion(suggestion) {
        this.$router.push({ name: 'EditSuggestion', params: { suggestion } });
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
  
  .manage-title {
    font-size: 24px;
    margin-bottom: 40px;
    text-align: center;
  }
  
  .suggested-polls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .view-poll-suggestion-button {
    margin: 10px;
    padding: 20px;
    border-radius: 0px;
    align-content: center;
    border: none;
    cursor: pointer;
  }
  
  .view-poll-suggestion-button:hover {
    background-color: #0056b3;
  }
  </style>