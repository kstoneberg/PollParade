<template>
  <div class="poll">
    <canvas id="bgCanvas"></canvas>
    <div style="position: relative; z-index: 1;">
      <transition name="flip" mode="out-in">
        <div :key="voted ? 'prediction' : 'voting'">
          <!-- Voting Interface -->
          <div v-if="!voted && !predictionSubmitted">
            <h3>{{ displayDate }}</h3>
            <h1>{{ poll.question }}</h1>
            <div class="choices">
              <button
                v-for="(choice, index) in poll.choices"
                :key="choice.text"
                :style="{ backgroundColor: colors[index % colors.length] }"
                @click="submitVote(choice.text)"
                @mouseover="changeBackground(index)"
                class="choice-button">
                {{ choice.text }}
              </button>
            </div>
          </div>
          <!-- Prediction Interface -->
          <div v-if="voted && !predictionSubmitted">
            <h2>Predict which choice will get the most votes</h2>
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
      </transition>
      <!-- Confirmation and Results Viewing -->
      <div v-if="predictionSubmitted && yesterdayResults.length === 0">
        <h4>Your vote has been recorded.</h4>
        <button @click="viewYesterdayResults">View Yesterday's Results</button>
      </div>
      <div v-if="yesterdayResults.length > 0" class="chart-container">
        <h5>On {{ displayDate }} we asked you:</h5>
        <h1>{{ displayQuestion }}</h1>
        <canvas id="myChart"></canvas>
      </div>
    </div>
  </div>
</template>

  
  <script>
  import { ref, onMounted, computed, nextTick } from 'vue';
  import axios from 'axios';
  import { Chart, registerables } from "chart.js";

  
  Chart.register(...registerables);

  export default {
    name: 'PollComponent',
    setup() {
      const poll = ref({ date: '', question: '', choices: [] });
      const voted = ref(false);
      const predictionSubmitted = ref(false);
      const yesterdayResults = ref([]);
      const displayQuestion = ref('');
      var myChart;

      const colors = ["#ff4b4b", "#4b6bff", "#47d147", "#ffa500"];  //red, blue, green, orange
      const bgGradients = [
          { start: "#ffada9", end: "#ff4d4d" }, // red gradient
          { start: "#add8ff", end: "#004dff" }, // blue gradient
          { start: "#b2ff66", end: "#398a3b" }, // green gradient
          { start: "#ffd699", end: "#ff8c00" }  // orange gradient
      ];
      let lastHovered = -1;
      const canvas = ref(null);

      var displayDate = computed(() => {
        return poll.value.date.slice(5);
      });

      onMounted(() => {
        const dateString = new Date().toISOString()
        console.log(dateString);
        canvas.value = document.getElementById('bgCanvas');
        window.addEventListener('resize', adjustCanvasSize);
        //resetBackground();
        adjustCanvasSize();
      });

      const adjustCanvasSize = () => {
        if (canvas.value) {
          //const rect = canvas.value.parentNode.getBoundingClientRect();
          canvas.value.width = window.innerWidth; // Set width to container's width
          canvas.value.height = window.innerHeight; // Set height to container's height
          draw(); // Redraw the content after resizing
        }
      };

      const draw = () => {
        const ctx = canvas.value.getContext('2d');
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.value.width, canvas.value.height); // Fill the canvas
      };

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
          console.log(response.data.message);
          predictionSubmitted.value = true;
        } catch (error) {
          console.error('Failed to submit prediction:', error);
          alert('Failed to submit prediction');
        }
      };

      const viewYesterdayResults = async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);  // Set the date to yesterday
        const dateString = yesterday.toISOString().split('T')[0];  // Format as 'YYYY-MM-DD'

        try {
            const response = await axios.get(`http://localhost:5656/polls/results/${dateString}`);
            yesterdayResults.value = response.data.choices;  // Store the fetched results
            if (response.data && response.data.question) {
                displayQuestion.value = response.data.question;  // Update the question
            }

            displayDate = dateString;

            await nextTick(); // Wait for the DOM to update
            createChart();
        } catch (error) {
            console.error('Failed to fetch yesterday\'s results:', error);
            alert('Failed to retrieve results');
        }
      };


      const changeBackground = (index) => {
        if(index != lastHovered){
          const ctx = canvas.value.getContext('2d');
          let alpha = 0; // Start with a fully transparent canvas
          const colors = bgGradients[index % bgGradients.length];

          const animateGradient = () => {
              ctx.globalAlpha = alpha; // Set current alpha for the drawing
              const gradient = ctx.createLinearGradient(0, 0, 0, canvas.value.height);
              gradient.addColorStop(0, colors.start);
              gradient.addColorStop(1, colors.end);
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

              alpha += 0.05; // Increment the opacity
              if (alpha <= 1) {
                  requestAnimationFrame(animateGradient); // Continue animation
              } else {
                  ctx.globalAlpha = 1; // Ensure the gradient is fully visible
              }
          };

          animateGradient(); // Start the animation
        }
        lastHovered = index;
      };

      const createChart = () => {
        nextTick(() => {
          var chartCanvas = document.getElementById('myChart');
          if (chartCanvas) {
            var ctx = chartCanvas.getContext('2d');
            if (ctx) {
              // Destroy existing chart instance if exists
              if (myChart) myChart.destroy();

              myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: yesterdayResults.value.map(choice => choice.text),
                  datasets: [{
                    data: yesterdayResults.value.map(choice => choice.votes),
                    backgroundColor: ['#ff4b4b', '#4b6bff', '#47d147', '#ffa500'],
                    hoverOffset: 4
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false
                }
              });
            } else {
              console.error('Failed to get context from canvas');
            }
          } else {
            console.error('Canvas element not found');
          }
        });
      }


      const resetBackground = () => {
        const ctx = canvas.value.getContext('2d');
        let alpha = 1; // Start fading out from full opacity

        const animateReset = () => {
            ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // Clear the canvas
            ctx.globalAlpha = alpha; // Apply current alpha
            ctx.fillStyle = 'white'; // Fill with white
            ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

            alpha -= 0.05; // Decrease opacity
            if (alpha >= 0) {
                requestAnimationFrame(animateReset); // Continue animation
            } else {
                ctx.globalAlpha = 0; // Ensure canvas is fully cleared at the end
            }
          };

         animateReset(); // Start the reset animation
      };
  
      onMounted(fetchPoll);
  
      return { poll,
               voted,
               predictionSubmitted,
               submitVote,
               submitPrediction,
               viewYesterdayResults,
               yesterdayResults,
               colors,
               changeBackground,
               resetBackground,
               displayDate,
               displayQuestion,
               createChart,
               myChart
             };
    }
  };
  </script>
  
  <style scoped>

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh; /* Ensures that the body takes up the full height of the viewport */
    overflow: hidden; /* Prevents scrolling */
  }

  .poll {
    position: fixed;
    text-align: center;
    font-family: Arial, sans-serif;
    font-variant-caps: all-small-caps;
    font-size: 44px;
    height: 100vh; 
    width: 100vw;
    display: flex;
    justify-content: center;
    /*margin-top: 5%;*/
    overflow: visible;
  }

  #bgCanvas {
    margin: 0;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    display: block;
  }

  .chart-container {
    width: 100%; /* Full width of its parent */
    height: 600px; /* Fixed height */
    margin: auto; /* Center it horizontally */
    position: relative; /* Position context for the canvas */
  }

  #myChart {
    width: 100%; /* Full width of its container */
    height: 100%; /* Full height of its container */
  }


  /* Style for Questions */
  h1 {
    font-size: 4.5rem; /* Larger font size for better readability */
    font-weight: 800; /* Bolder for emphasis */
    text-decoration: underline overline;
    text-decoration-thickness: 6px;
    text-underline-offset: 30px;
    color: #333; /* Darker shade for better contrast */
    margin: 0 0 30px; /* Added spacing below the question */

  }

  /* Style for Prediction Prompt */
  h2 {
    font-size: 3.5rem; /* Larger font size for better readability */
    font-weight: 800; /* Bolder for emphasis */
    text-decoration: underline overline;
    text-underline-offset: 30px;
    color: #333; /* Darker shade for better contrast */
    margin: 0 0 30px; /* Added spacing below the question */
    margin-top: 5%;
  }

  /* Style for display date */
  h3 {
    font-size: 1.5rem; /* Larger font size for better readability */
    font-weight: 10; /* Bolder for emphasis */
    color: #333; /* Darker shade for better contrast */
    margin-top: 5%;
  }

  /* Style for your vote has been recorded */
  h4 {
    font-size: 1.5rem; /* Larger font size for better readability */
    font-weight: 10; /* Bolder for emphasis */
    color: #333; /* Darker shade for better contrast */
    margin-top: 5%;
  }

  /* Style for yesterday's results prompt */
  h5 {
    font-size: 1.5rem; /* Larger font size for better readability */
    font-weight: 10; /* Bolder for emphasis */
    color: #333; /* Darker shade for better contrast */
    margin-top: 5%;
  }
  
  .choice-button {
    margin: 30px;
    border-radius: 50px;
    border: 0.7rem solid rgba(255, 255, 255, 0.315);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 30%; /* Adjust based on total width for better mobile responsiveness */
    min-width: 400px;
    min-height: 550px;
    transition: 0.2s ease-in;
  }

  .prediction-button {
    margin: 20px;
    padding: 20px 60px;
    border-radius: 10px;
    border: 0.7rem solid rgba(0, 0, 0, 0.315);
    color: black;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 20%; /* Adjust based on total width for better mobile responsiveness */
    transition: 0.2s ease-in;
  }

  .choice-button:hover {
    transform: scale(1.1);  /*makes the button grow*/
  }

  .choices {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
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

  /****TRANSITIONS****/

  /*fade*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.6s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }

  /*slide*/
  .slide-enter-active, .slide-leave-active {
    transition: transform 0.5s;
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateX(100%);
  }

  /*flip*/
  .flip-enter-active, .flip-leave-active {
    transition: transform 0.6s cubic-bezier(0.455, 0.030, 0.515, 0.955);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  .flip-enter-from, .flip-leave-to {
    transform: rotateX(180deg);
  }

  /*expand*/
  .expand-enter-active, .expand-leave-active {
    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  }
  .expand-enter-from, .expand-leave-to {
    max-height: 0;
    opacity: 0;
  }

  /*******************/
  </style>
  