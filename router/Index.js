import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import MonthlyBudget from '../MonthlyBudget.vue'

const routes = [
  { path: '/', name: 'ExpenseTracker', component: App },
  { path: '/monthly-budget', name: 'MonthlyBudget', component: MonthlyBudget }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
