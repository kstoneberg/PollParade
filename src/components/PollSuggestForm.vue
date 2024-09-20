<template>
    <v-app>
        <v-container>
            <div v-if="!suggestedAlready">
                <v-form v-model="valid" ref="form">
                    <!--Title-->
                    <v-row justify="center">
                        <v-col cols="12" md="6" class="text-center">
                            <h1>Suggest a Poll</h1>
                        </v-col>
                    </v-row>

                    <!--Sub Title-->
                    <v-row justify="center">
                        <v-col cols="12" md="6" class="text-center">
                            <h3>Have An Idea For A Poll? Let Us Know And Maybe It Will Be Featured</h3>
                        </v-col>
                    </v-row>
                    
                    <v-row>
                        <!--Question-->
                        <v-col cols="12" md="6" offset-md="3">
                            <v-text-field
                                v-model="question"
                                :counter="300"
                                :rules="questionRules"
                                label="Question"
                                required
                            ></v-text-field>
                        </v-col>

                        <!--Option 1-->
                        <v-col cols="12" md="6" offset-md="3">
                            <v-text-field
                                v-model="option1"
                                :counter="50"
                                :rules="optionRules"
                                label="Option 1"
                                required
                            ></v-text-field>
                        </v-col>

                        <!--Option 2-->
                        <v-col cols="12" md="6" offset-md="3">
                            <v-text-field
                                v-model="option2"
                                :counter="50"
                                :rules="optionRules"
                                label="Option 2"
                                required
                            ></v-text-field>
                        </v-col>

                        <!--Option 3-->
                        <v-col cols="12" md="6" offset-md="3">
                            <v-text-field
                                v-model="option3"
                                :counter="50"
                                :disabled="!(option1 && option2)"
                                label="Option 3 (Optional)"
                            ></v-text-field>
                        </v-col>

                        <!--Option 4-->
                        <v-col cols="12" md="6" offset-md="3">
                            <v-text-field
                                v-model="option4"
                                :counter="50"
                                :disabled="!option3"
                                label="Option 4 (Optional)"
                                hide-details
                            ></v-text-field>
                        </v-col>

                        <!--Submit Button-->
                        <v-col cols="6" md="2" offset-md="5">
                            <v-btn color="primary" class="mt-2" block @click="submitSuggestion">
                                Submit
                            </v-btn>
                        </v-col>

                    </v-row>
                </v-form>
            </div>
            <div v-else>
                <v-row justify="center">
                    <v-col cols="12" md="6" class="text-center">
                        <h3>Your suggestion has been submitted. Come back tomorrow to suggest another.</h3>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </v-app>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data: () => ({
    valid: false,
    question: '',
    questionRules: [
      value => !!value || 'Question Is Required.'
    ],
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    optionRules: [
      value => !!value || 'At Least 2 Options Are Required.'
    ],
    suggestedAlready: false, // Added to track if the user has already suggested today
  }),
  methods: {
    // Check if the user has already suggested today
    checkIfSuggested() {
      const todayString = new Date().toISOString().split('T')[0];
      const suggestedDate = Cookies.get('suggestedDate');
      if (suggestedDate === todayString) {
        this.suggestedAlready = true; // User has already suggested today
      }
    },

    async submitSuggestion() {
      if (!this.$refs.form.validate()) {
        return;
      }

      // Gather options into an array
      const options = [this.option1, this.option2];
      if (this.option3) options.push(this.option3);
      if (this.option4) options.push(this.option4);

      // Create the suggestion
      const suggestion = {
        question: this.question,
        choices: options
      };

      try {
        const response = await axios.post('http://localhost:5656/polls/suggestions', suggestion);
        alert(response.data.message || 'Your suggestion has been submitted successfully!');

        // Set cookie if the suggestion was submitted successfully
        Cookies.set('suggestedDate', new Date().toISOString().split('T')[0], { expires: 1 });

        // Update the flag to hide the form and show the message
        this.suggestedAlready = true;

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to submit suggestion';
        alert(errorMessage);
      }
    }
  },
  created() {
    this.checkIfSuggested(); // Check if the user has already suggested when the component is created
  }
}
</script>
