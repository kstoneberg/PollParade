<template>
    <div class="button-container">
        <button @click="$router.push('/')">Go to Poll</button>
        <button @click="viewHistory">View Poll History</button>
    </div>
    <div class="poll-results-container">
        <h5 class="results-title">On {{ displayDate }} we asked you:</h5>
        <h1>{{ displayQuestion }}</h1>
        <div class="chart-container">
        <canvas id="myChart"></canvas>
        </div>
    </div>
</template>

  
<script>
import axios from 'axios';
import { ref, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useRoute, useRouter } from 'vue-router';

Chart.register(...registerables);

export default {
name: 'PollResultsPage',
setup() {
    const pollResults = ref([]);
    const displayQuestion = ref('');
    const displayDate = ref('');
    let myChart = null;
    const route = useRoute();
    const router = useRouter();

    const viewHistory = () => {
    router.push({ name: 'PollHistory' });
    };

    const fetchPollResults = async () => {
    const dateString = route.params.date;

    try {
        const response = await axios.get(`http://localhost:5656/polls/results/${dateString}`);
        pollResults.value = response.data.choices; // Store the fetched results
        if (response.data && response.data.question) {
        displayQuestion.value = response.data.question; // Update the question
        }
        displayDate.value = dateString;

        await nextTick(); // Wait for the DOM to update
        createChart();
    } catch (error) {
        console.error("Failed to fetch yesterday's results:", error);
        alert('Failed to retrieve results');
    }
    };

    const createChart = () => {
    nextTick(() => {
        const chartCanvas = document.getElementById('myChart');
        if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        if (ctx) {
            // Destroy existing chart instance if exists
            if (myChart) myChart.destroy();

            myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: pollResults.value.map(choice => choice.text),
                datasets: [{
                data: pollResults.value.map(choice => choice.votes),
                backgroundColor: ['#ff4b4b', '#4b6bff', '#47d147', '#ffa500'],
                borderColor: ['#1d3557', '#1d3557', '#1d3557', '#1d3557'],
                borderWidth: 2,
                hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                }
                },
                animation: {
                animateScale: true,
                animateRotate: true
                },
                plugins: {
                legend: {
                    position: 'top',
                    labels: {
                    font: {
                        size: 18,
                        style: 'italic',
                        family: 'Arial',
                        weight: 'bold'
                    },
                    color: '#1d3557',
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                        label += ': ';
                        }
                        if (context.raw !== null) {
                        label += context.raw + ' votes';
                        }
                        return label;
                    }
                    }
                }
                }
            }
            });
        } else {
            console.error('Failed to get context from canvas');
        }
        } else {
        console.error('Canvas element not found');
        }
    });
    };

    fetchPollResults();

    return {
    pollResults,
    displayQuestion,
    displayDate,
    createChart,
    viewHistory
    };
}
};
</script>

<style scoped>
.button-container {
    display: flex; /* Use flexbox for button layout */
    justify-content: flex-start; /* Align buttons to the left (or change as needed) */
    gap: 10px; /* Add space between buttons */
    margin-bottom: 20px; /* Add space below the buttons */
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.poll-results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

#myChart {
    width: 100%;
    height: 600px;
}

.chart-container {
    width: 100%; /* Full width of its parent */
    height: 600px; /* Fixed height */
    margin: auto; /* Center it horizontally */
    position: relative; /* Position context for the canvas */
}

</style>