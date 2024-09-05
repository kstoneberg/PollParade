// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Poll from '../components/Poll.vue';
import PollHistory from '../components/PollHistory.vue';

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;