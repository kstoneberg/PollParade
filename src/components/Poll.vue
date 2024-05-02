<template>
  <div class="poll">
    <canvas id="bgCanvas" style="position: absolute; top: 0; left: 0; z-index: -1; width: 100%; height: 100%;"></canvas>
    <div style="position: relative; z-index: 1;">
      <transition name="flip" mode="out-in">
        <div :key="voted ? 'prediction' : 'voting'">
          <div v-if="!voted">
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
          <div v-if="voted">
            <h2>Predict which choice will get the most votes:</h2>
            <div class="choices predictions">
              <button
                v-for="choice in poll.choices"
                :key="choice.text"
                :style="{ backgroundColor: 'white'}"
                @click="submitPrediction(choice.text)"
                class="prediction-button">
                {{ choice.text }}
              </button>
            </div>
          </div>
        </div>
      </transition>
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
      //colors for vote choice buttons
      const colors = ["#ff4b4b", "#4b6bff", "#47d147", "#ffa500"];  //red, blue, green, orange
      const bgGradients = [
          { start: "#ffada9", end: "#ff4d4d" }, // red gradient
          { start: "#add8ff", end: "#004dff" }, // blue gradient
          { start: "#b2ff66", end: "#398a3b" }, // green gradient
          { start: "#ffd699", end: "#ff8c00" }  // orange gradient
      ];
      let lastHovered = -1;
      const canvas = ref(null);

      onMounted(() => {
        canvas.value = document.getElementById('bgCanvas');
        adjustCanvasSize();
        window.addEventListener('resize', adjustCanvasSize);
        resetBackground();
        adjustCanvasSize();
      });

      const adjustCanvasSize = () => {
        if (canvas.value) {
          const rect = canvas.value.parentNode.getBoundingClientRect();
          canvas.value.width = rect.width; // Set width to container's width
          canvas.value.height = rect.height; // Set height to container's height
          draw(); // Redraw the content after resizing
        }
      };

      const draw = () => {
        const ctx = canvas.value.getContext('2d');
        // Any drawing operations go here, e.g., fill with a color
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
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

      /*STOP HERE */
  
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
  
      onMounted(fetchPoll);
  
      return { poll, voted, submitVote, submitPrediction, colors, changeBackground, resetBackground };
    }
  };
  </script>
  
  <style scoped>
  .poll {
    position: relative;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 44px;
    height: 95vh; /* Adjust height as needed */
    margin: 0;
    overflow: hidden;
  }

  #bgCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
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
    transform: rotateY(180deg);
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
  
  .choice-button {
    margin: 30px;
    padding: 300px 150px;
    border-radius: 50px;
    border: none;
    color: white;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 50%; /* Adjust based on total width for better mobile responsiveness */
    transition: 0.2s ease-in;
  }

  .prediction-button {
    margin: 20px;
    padding: 20px 60px;
    border-radius: 10px;
    border: none;
    color: black;
    font-family: Arial, sans-serif;
    font-size: 1em;
    width: 20%; /* Adjust based on total width for better mobile responsiveness */
    transition: 0.4s ease-in;
  }

  .choice-button:hover {
    transform: scale(1.1);  /*makes the button grow*/
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
  