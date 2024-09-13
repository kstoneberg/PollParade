<template>
  <div class="poll">

    <v-btn @click="viewHistory" class="view-history-button" color="primary">
      View Poll History
    </v-btn>
    <button @click="infoVisible = !infoVisible" class="view-info-button">?</button>

    <!-- For debugging: Clears cookies-->
    <button @click="clearCookies" class="clear-cookies-button">Clear Cookies</button>

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

      <!-- Info Popup -->
      <div v-if="infoVisible" class="info-popup">
        <div class="info-content">
          <h2>Welcome To Poll Parade</h2>
          <p>Come back every day for a new poll<br>
             Vote for your favorite choice and predict the winner<br>
             Check back tomorrow to see the results and compare with your prediction
          </p>
          <button @click="infoVisible = false" class="close-info-button">Close</button>
        </div>
      </div>

      <!-- Confirmation and Results Viewing -->
      <div v-if="predictionSubmitted && yesterdayResults.length === 0">
        <h4>Your vote has been recorded</h4>
        <button @click="viewYesterdayResults" class="view-results-button">View Yesterday's Results</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Chart, registerables } from "chart.js";
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import '../components/Poll.css'; // Import the CSS file
import { VBtn } from 'vuetify/components';

Chart.register(...registerables);

export default {
  name: 'PollComponent',
  components: {
    VBtn, // Register the Vuetify Button component
  },
  setup() {
    const poll = ref({ date: '', question: '', choices: [] });
    const voted = ref(false);
    const predictionSubmitted = ref(false);
    const yesterdayResults = ref([]);
    const displayQuestion = ref('');
    const infoVisible = ref(false);
    var myChart;
    const router = useRouter();

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
      fetchPoll();
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
        checkIfVoted();
      } catch (error) {
        console.error('Failed to fetch poll:', error);
      }
    };

    //Check if the user has already voted and predicted today
    const checkIfVoted = () => {
      const todayString = new Date().toISOString().split('T')[0];
      const votedDate = Cookies.get('votedDate');
      const predictionDate = Cookies.get('predictionDate');
      if (votedDate === todayString) {
        voted.value = true; // When true go to results
        if (predictionDate === todayString) {
          predictionSubmitted.value = true; // When true show confirmation
        }
      }
    };

    const submitVote = async (choice) => {
      try {
        if (voted.value) {
          alert('You have already voted today.');
          return;
        }
        console.log(`Vote submitted: ${choice}`);
        const response = await axios.post('http://localhost:5656/vote', {
          choice: choice,
          date: new Date().toISOString().split('T')[0]
        });
        console.log(response.data.message);  // Display a simple alert with the server response
        voted.value = true;  // Change state to show prediction options
        // Set cookie to expire in 1 day
        Cookies.set('votedDate', new Date().toISOString().split('T')[0], { expires: 1 });
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
        Cookies.set('predictionDate', new Date().toISOString().split('T')[0], { expires: 1 });
      } catch (error) {
        console.error('Failed to submit prediction:', error);
        alert('Failed to submit prediction');
      }
    };

    const viewYesterdayResults = async () => {
      router.push({ name: 'YesterdaysResults' });
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

    const viewHistory = () => {
      router.push({ name: 'PollHistory' });
    };

    //DEBUGGING
    const clearCookies = () => {
      Cookies.remove('votedDate');
      Cookies.remove('predictionDate');
      voted.value = false;
      predictionSubmitted.value = false;
      alert('Cookies cleared');
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
              myChart,
              viewHistory,
              infoVisible,
              clearCookies //DEBUGGING
            };
  }
};
</script>



