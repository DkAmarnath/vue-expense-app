import { createRouter, createWebHistory } from 'vue-router';
import ExpenseTracker from '../src/components/ExpenseTracker.vue';
import MonthlyBudget from '../src/components/MonthlyBudget.vue';

const routes = [
  { path: '/', component: ExpenseTracker },
  { path: '/budget', component: MonthlyBudget }]

export default createRouter({
  history: createWebHistory(),
  routes
});
