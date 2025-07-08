import { createRouter, createWebHistory } from 'vue-router';
import ExpenseTracker from '../src/components/ExpenseTracker.vue';
import MonthlyBudget from '../src/components/MonthlyBudget.vue';
import TaskTracker from '../src/components/TaskTracker.vue'; 

const routes = [
  { path: '/', component: ExpenseTracker },
  { path: '/budget', component: MonthlyBudget },
  { path: '/tasks', component: TaskTracker }]

export default createRouter({
  history: createWebHistory(),
  routes
});
