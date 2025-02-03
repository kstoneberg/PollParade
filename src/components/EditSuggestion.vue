<template>
    <v-btn @click="$router.push('/manage-suggestions')" color="primary">Back</v-btn>
    <v-container class="edit-suggestion" v-if="editableSuggestion">
        <v-card>
            <v-card-title>Edit Suggestion</v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field
                        v-model="editableSuggestion.question"
                        label="Question"
                        outlined
                    ></v-text-field>
                    <v-text-field
                        v-model="editableSuggestion.choices"
                        label="Choices"
                        outlined
                    ></v-text-field>
                    <v-text-field
                        v-model="editableSuggestion.submittedAt"
                        label="Submitted At"
                        outlined
                        readonly
                    ></v-text-field>
                    <v-select
                        v-model="editableSuggestion.status"
                        :items="statusOptions"
                        label="Status"
                        outlined
                    ></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="saveChanges">Save Changes</v-btn>
                <v-btn color="success" @click="handleApproval">Approve</v-btn>
                <v-btn color="error" @click="handleRejection">Reject</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
    <div v-else>
        Loading...
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'EditSuggestion',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            editableSuggestion: null,
            statusOptions: ['pending', 'approved', 'rejected']
        };
    },
    created() {
        this.fetchSuggestion();
    },
    methods: {
        async fetchSuggestion() {
            try {
                const response = await axios.get(`http://localhost:5656/edit-suggestion/${this.id}`);
                console.log('Fetched suggestions:', response.data);
                this.editableSuggestion = response.data;
            } catch (error) {
                console.error('Failed to fetch suggestion:', error);
            }
        },
        saveChanges() {
            // Logic to save changes to the suggestion
            // For example, send a PUT request to update the suggestion
            axios.put(`http://localhost:5656/edit-suggestion/${this.id}`, this.editableSuggestion)
                .then(() => {
                    alert('Changes saved successfully.');
                })
                .catch(error => {
                    console.error('Failed to save changes:', error);
                });
        },
        handleApproval() {
            // Logic to approve the suggestion
            this.editableSuggestion.status = 'approved';
            this.saveChanges();
            // Optionally, emit an event or navigate away
        },
        handleRejection() {
            // Logic to reject the suggestion
            this.editableSuggestion.status = 'rejected';
            this.saveChanges();
            // Optionally, emit an event or navigate away
        }
    }
};
</script>


<style scoped>
.edit-suggestion {
    max-width: 600px;
    margin: 0 auto;
}
</style>