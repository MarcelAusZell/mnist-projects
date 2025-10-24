import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Pages/Home/Home.vue';
import DigitRecognition from './components/Pages/Classification/DigitRecognition/DigitRecognition.vue';
import LetterRecognition from './components/Pages/Classification/LetterRecognition/LetterRecognition.vue';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/digit-recognition',
    component: DigitRecognition,
  },
  {
    path: '/letter-recognition',
    component: LetterRecognition,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;