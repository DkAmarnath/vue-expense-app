<template>
  <div style='padding: 20px; max-width: 600px; margin: auto;'>
    <h1>💰 Expense Tracker</h1>

    <div style='margin-top: 20px;'>
      <input v-model="entry.date" type="date" />
      <input v-model="entry.description" placeholder="Description" />
      <input v-model.number="entry.amount" type="number" placeholder="Amount" />
      <button @click="addExpense">Add</button>
    </div>

    <hr />

    <h2>Expenses Summary</h2>
    <p><strong>Total:</strong> ₹{{ total }}</p>

    <div v-for="(items, date) in groupedExpenses" :key="date" style="margin-top: 15px;">
      <h4>{{ date }}</h4>
      <ul>
        <li v-for="(e, i) in items" :key="i">
          {{ e.description }} — ₹{{ e.amount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue';

export default {
  setup() {
    const entry = reactive({ date: '', description: '', amount: null });
    const expenses = reactive([]);
    const API = 'https://dailyexpensetracker-459m.onrender.com/expenses'; // Replace with your Express API

    const loadExpenses = async () => {
      const res = await fetch(API);
      const data = await res.json();
      expenses.splice(0, expenses.length, ...data);
    };

    const addExpense = async () => {
      if (!entry.date || !entry.description || !entry.amount) return;
      const newExp = { ...entry };
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      if (res.ok) {
        const saved = await res.json();
        expenses.push(saved);
        entry.description = '';
        entry.amount = null;
      }
    };

    const groupedExpenses = computed(() =>
      expenses.reduce((acc, exp) => {
        if (!acc[exp.date]) acc[exp.date] = [];
        acc[exp.date].push(exp);
        return acc;
      }, {})
    );

    const total = computed(() => expenses.reduce((sum, e) => sum + e.amount, 0));

    onMounted(loadExpenses);

    return { entry, addExpense, groupedExpenses, total };
  }
};
</script>

<style>
input {
  margin: 5px;
  padding: 6px;
}
button {
  padding: 6px 10px;
}
</style>