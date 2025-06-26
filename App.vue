<template>
  <div class="container">
    <header>
      <img src="/logo.png" alt="Expense Tracker Logo" class="logo" />
      <h1>Expense Tracker</h1>
      <h2 class="total">Total: ₹ {{ totalExpense }}</h2>
    </header>

    <!-- Entry Form -->
    <section class="form">
      <input v-model="entry.date" type="date" />
      <input v-model="entry.description" placeholder="Description" />
      <input v-model.number="entry.amount" type="number" placeholder="Amount" />
      <button @click="isEditing ? updateExpense() : addExpense()">
        {{ isEditing ? 'Update' : 'Add' }}
      </button>
      <button v-if="isEditing" class="cancel" @click="cancelEdit">Cancel</button>
    </section>

    <!-- Search & Sort -->
    <div class="search-sort">
      <input v-model="search" class="search" placeholder="🔍 Search description..." />
      <select v-model="sortBy">
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
        <option value="description">Sort by Description</option>
      </select>
    </div>

    <!-- Export Button -->
    <div class="export-button">
      <button @click="exportToExcel">⬇ Export to Excel</button>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>₹ Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in paginatedExpenses" :key="expense.id">
            <td>{{ expense.date }}</td>
            <td>{{ expense.description }}</td>
            <td>{{ expense.amount }}</td>
            <td>
              <button @click="startEdit(expense)">✏️</button>
              <button @click="deleteExpense(expense.id)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="page--" :disabled="page === 1">⬅ Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="page++" :disabled="page === totalPages">Next ➡</button>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';

export default {
  setup() {
    const today = new Date().toISOString().split('T')[0];
    const entry = reactive({ id: null, date: today, description: '', amount: null });
    const expenses = ref([]);
    const API = 'https://dailyexpensetracker-459m.onrender.com/expenses';
    const isEditing = ref(false);
    const search = ref('');
    const sortBy = ref('date');
    const page = ref(1);
    const pageSize = 5;

    const loadExpenses = async () => {
      const res = await fetch(API);
      const data = await res.json();
      expenses.value = data;
    };

    const filteredExpenses = computed(() => {
      return expenses.value
        .filter(e => e.description.toLowerCase().includes(search.value.toLowerCase()))
        .sort((a, b) => {
          if (sortBy.value === 'amount') return b.amount - a.amount;
          if (sortBy.value === 'description') return a.description.localeCompare(b.description);
          return new Date(b.date) - new Date(a.date);
        });
    });

    const totalPages = computed(() => Math.ceil(filteredExpenses.value.length / pageSize));

    const paginatedExpenses = computed(() => {
      const start = (page.value - 1) * pageSize;
      return filteredExpenses.value.slice(start, start + pageSize);
    });

    const totalExpense = computed(() => {
      return expenses.value.reduce((sum, e) => sum + Number(e.amount), 0);
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

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredExpenses.value);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
      XLSX.writeFile(workbook, 'expenses.xlsx');
    };

    onMounted(loadExpenses);

    return {
      entry, addExpense, deleteExpense, updateExpense, cancelEdit,
      startEdit, isEditing, search, sortBy, page, totalPages, paginatedExpenses,
      exportToExcel, totalExpense
    };
  }
};
</script>

<style>
body {
  font-family: 'Segoe UI', sans-serif;
  background: #f4f6f8;
  margin: 0;
  padding: 0;
}
.container {
  background: white;
  max-width: 960px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
header {
  text-align: center;
  margin-bottom: 20px;
}
.logo {
  height: 60px;
  margin-bottom: 10px;
}
h1 {
  color: #2c3e50;
  margin-bottom: 5px;
}
.total {
  color: #388e3c;
  font-size: 1.2em;
  margin-top: 0;
}
input, select {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 22px);
  max-width: 250px;
}
button {
  padding: 10px 14px;
  margin: 5px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button.cancel {
  background: #888;
}
button:disabled {
  background: #ccc;
}
.search-sort {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 10px;
}
.search {
  flex: 1 1 60%;
  margin-right: 10px;
}
.export-button {
  text-align: right;
  margin-top: 10px;
}
.table-container {
  overflow-x: auto;
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
th {
  background: #f7f7f7;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
@media (max-width: 600px) {
  input, select {
    width: 100%;
  }
  table {
    font-size: 13px;
  }
  th, td {
    padding: 8px;
  }
  .search-sort {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
