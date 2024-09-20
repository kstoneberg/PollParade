// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Poll from '../components/Poll.vue';
import PollHistory from '../components/PollHistory.vue';
import YesterdaysResults from '../components/YesterdaysResults.vue';
import PastPollResults from '../components/PastPollResults.vue';
import PollSuggestForm from '../components/PollSuggestForm.vue';


const routes = [
  {
    path: '/',
    name: 'Poll',
    component: Poll,
  },
  {
    path: '/history',
    name: 'PollHistory',
    component: PollHistory,
  },
  {
    path: '/yesterday',
    name: 'YesterdaysResults',
    component: YesterdaysResults,
  },
  {
    path: '/results',
    name: 'PastPollResults',
    component: PastPollResults,
  },
  {
    path: '/PollSuggestForm',
    name: 'PollSuggestForm',
    component: PollSuggestForm,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;