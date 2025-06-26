// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import MonthlyBudget from '../Monthlybudget.vue'

const routes = [
  { path: '/', name: 'Home', component: App },
  { path: '/monthly-budget', name: 'MonthlyBudget', component: MonthlyBudget }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
