<template>
  <div style="padding: 20px; max-width: 800px; margin: auto;">
    <h1>💰 Expense Tracker</h1>

    <!-- Form -->
    <div style="margin-top: 20px;">
      <input v-model="entry.date" type="date" />
      <input v-model="entry.description" placeholder="Description" />
      <input v-model.number="entry.amount" type="number" placeholder="Amount" />
      <button @click="isEditing ? updateExpense() : addExpense()">
        {{ isEditing ? 'Update' : 'Add' }}
      </button>
      <button v-if="isEditing" @click="cancelEdit">Cancel</button>
    </div>

    <!-- Search -->
    <div style="margin-top: 20px;">
      <input v-model="search" placeholder="Search by description..." style="width: 100%; padding: 8px;" />
    </div>

    <!-- Table -->
    <table border="1" cellpadding="10" cellspacing="0" style="margin-top: 20px; width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in paginatedExpenses" :key="expense.id">
          <td>{{ expense.date }}</td>
          <td>{{ expense.description }}</td>
          <td>₹{{ expense.amount }}</td>
          <td>
            <button @click="startEdit(expense)">Edit</button>
            <button @click="deleteExpense(expense.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div style="margin-top: 20px;">
      <button @click="page--" :disabled="page === 1">Prev</button>
      Page {{ page }} of {{ totalPages }}
      <button @click="page++" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const entry = reactive({ id: null, date: '', description: '', amount: null });
    const expenses = ref([]);
    const API = 'https://dailyexpensetracker-459m.onrender.com/expenses'; // Replace with your backend URL
    const isEditing = ref(false);
    const search = ref('');
    const page = ref(1);
    const pageSize = 5;

    const loadExpenses = async () => {
      const res = await fetch(API);
      const data = await res.json();
      expenses.value = data;
    };

    const filteredExpenses = computed(() => {
      return expenses.value.filter(e => e.description.toLowerCase().includes(search.value.toLowerCase()));
    });

    const totalPages = computed(() => Math.ceil(filteredExpenses.value.length / pageSize));

    const paginatedExpenses = computed(() => {
      const start = (page.value - 1) * pageSize;
      return filteredExpenses.value.slice(start, start + pageSize);
    });

    const addExpense = async () => {
      if (!entry.date || !entry.description || !entry.amount) return;
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        await loadExpenses();
        clearEntry();
      }
    };

    const deleteExpense = async (id) => {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      await loadExpenses();
    };

    const startEdit = (exp) => {
      Object.assign(entry, exp);
      isEditing.value = true;
    };

    const updateExpense = async () => {
      await fetch(`${API}/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      await loadExpenses();
      cancelEdit();
    };

    const cancelEdit = () => {
      clearEntry();
      isEditing.value = false;
    };

    const clearEntry = () => {
      entry.id = null;
      entry.date = '';
      entry.description = '';
      entry.amount = null;
    };

    onMounted(loadExpenses);

    return {
      entry, addExpense, deleteExpense, updateExpense, cancelEdit,
      startEdit, isEditing, search, page, totalPages, paginatedExpenses
    };
  }
};
</script>

<style>
input {
  margin: 5px;
  padding: 6px;
}
button {
  margin: 2px;
  padding: 6px 10px;
}
</style>
