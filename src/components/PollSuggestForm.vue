<template>
    <v-app>
        <v-form v-model="valid">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="6" class="text-center">
                        <h1>Suggest a Poll</h1>
                    </v-col>
                </v-row>
                
                <v-row>
                    <!--Question-->
                    <v-col cols="12" md="6" offset-md="3">
                        <v-text-field
                            v-model="question"
                            :counter="10"
                            :rules="questionRules"
                            label="Question"
                            required
                        ></v-text-field>
                    </v-col>

                    <!--Option 1-->
                    <v-col cols="12" md="6" offset-md="3">
                        <v-text-field
                            v-model="option1"
                            :counter="10"
                            :rules="optionRules"
                            label="Option 1"
                            required
                        ></v-text-field>
                    </v-col>

                    <!--Option 2-->
                    <v-col cols="12" md="6" offset-md="3">
                        <v-text-field
                            v-model="option2"
                            :counter="10"
                            :rules="optionRules"
                            label="Option 2"
                        ></v-text-field>
                    </v-col>

                    <!--Option 3-->
                    <v-col cols="12" md="6" offset-md="3">
                        <v-text-field
                            v-model="option3"
                            :counter="10"
                            :disabled="!(option1 && option2)"
                            label="Option 3"
                        ></v-text-field>
                    </v-col>

                    <!--Option 3-->
                    <v-col cols="12" md="6" offset-md="3">
                        <v-text-field
                            v-model="option4"
                            :counter="10"
                            :disabled="!option3"
                            label="Option 4"
                            hide-details
                        ></v-text-field>
                    </v-col>

                    <!--Submit Button-->
                    <v-col cols="6" md="2" offset-md="5">
                        <v-btn color="primary" class="mt-2" type="submit" block>
                            Submit
                        </v-btn>
                    </v-col>

                </v-row>
            </v-container>
        </v-form>
    </v-app>
  </template>
  <script>
    export default {
      data: () => ({
        valid: false,
        question: '',
        questionRules: [
          value => {
            if (value) return true
  
            return 'Question Is Required.'
          }
        ],
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        optionRules: [
            value => {
                if (value) return true
    
                return 'At Least 2 Options Are Required.'
            }
        ],
      }),
    }
  </script>