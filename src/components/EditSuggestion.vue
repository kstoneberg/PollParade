<template>
    <v-btn @click="$router.push('/manage-suggestions')" color="primary">Back</v-btn>
    <v-container class="edit-suggestion">
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
</template>

<script>
export default {
    name: 'EditSuggestion',
    props: {
        suggestion: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editableSuggestion: { ...this.suggestion },
            statusOptions: ['pending', 'approved', 'rejected']
        };
    },
    methods: {
        saveChanges() {
            // Logic to save changes to the suggestion
            this.$emit('update-suggestion', this.editableSuggestion);
        },
        handleApproval() {
            // Logic to approve the suggestion and add to Poll database
            this.editableSuggestion.status = 'approved';
            this.$emit('approve-suggestion', this.editableSuggestion);
        },
        handleRejection() {
            // Logic to reject the suggestion and delete from suggestion database
            this.editableSuggestion.status = 'rejected';
            this.$emit('reject-suggestion', this.editableSuggestion);
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