// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ExpenseTracker from '../App.vue'
import MonthlyBudget from '../components/MonthlyBudget.vue'

const routes = [
  { path: '/', name: 'ExpenseTracker', component: ExpenseTracker },
  { path: '/monthly-budget', name: 'MonthlyBudget', component: MonthlyBudget }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
