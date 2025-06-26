// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ExpenseTracker from '../App.vue'
import MonthlyBudget from '../MonthlyBudget.vue'

const routes = [
  { path: '/', name: 'ExpenseTracker', component: ExpenseTracker },
  { path: '/monthly-budget', name: 'MonthlyBudget', component: MonthlyBudget }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
