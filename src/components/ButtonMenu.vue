<template>
  <v-dialog max-width="300">
    <!-- Activator (Menu Icon) -->
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        variant="flat"
        icon
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>

    <!-- Dialog Content -->
    <template v-slot:default="{ isActive }">
      <v-card color="primary">

        <!-- Close Button -->
        <v-btn
          icon
          @click="isActive.value = false"
          class="close-btn"
          outlined
          :size="25"
        >
        <v-icon :size="25">
            mdi-close
          </v-icon>
        </v-btn>

        <!-- Remove fixed height and unnecessary v-container -->
        <v-card-title class="text-h5 text-center">
          Poll Parade
        </v-card-title>

        <v-card-text class="d-flex flex-column" style="min-height: 100%;">
          <!-- Use a single container for content and button -->
          <template v-if="viewState === 'buttons'">
            <div class="d-flex flex-column align-center justify-center" style="flex: 1;">

              <!-- View Poll History Button -->
              <v-btn
                @click="$emit('view-history')"
                color="secondary"
                width="200"
                class="mb-2"
              >
                View Poll History
              </v-btn>

              <!-- Suggest a Poll Button -->
              <v-btn
                @click="$emit('suggest-poll')"
                color="secondary"
                width="200"
                class="mb-2"
              >
              Suggest a Poll
              </v-btn> 

              <!-- More Info Button -->
              <v-btn
                @click="showInfo"
                color="secondary"
                width="200"
                class="mb-2"
              >
                More Info
              </v-btn>

              <!--Manage Suggestions Button-->
              <v-btn
                @click="$router.push('/manage-suggestions')"
                color="error"
                width="200"
                class="mb-2"
              >
                Manage Suggestions
              </v-btn>

              <!-- Clear Cookies Button -->
              <v-btn
                @click="$emit('clear-cookies')"
                color="error"
                width="200"
                class="mb-2"
              >
                Clear Cookies
              </v-btn>
              
            </div>
          </template>

          <!-- Info Screen -->
          <template v-else-if="viewState === 'info'">
            <div class="d-flex flex-column justify-space-between" style="flex: 1;">
              <!-- Info Text -->
              <div>
                <p style="text-align: center">
                  Come back every day for a new poll<br>
                  Vote for your favorite choice and predict the winner<br>
                  Check back tomorrow to see the results and compare with your prediction
                </p>
              </div>

              <!-- Back Button -->
              <v-btn
                @click="showButtons"
                color="primary"
                width="200"
                class="mt-4 align-self-center"
              >
                Back
              </v-btn>
            </div>
          </template>
        </v-card-text>
         
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const viewState = ref('buttons');

    const showInfo = () => {
      viewState.value = 'info';
    };

    const showButtons = () => {
      viewState.value = 'buttons';
    };

    return {
      viewState,
      showInfo,
      showButtons
    };
  }
};
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
