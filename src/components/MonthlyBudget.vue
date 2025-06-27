<template>

  <div class="budget-container">
    <h1>Monthly Budget - {{ selectedMonth }}</h1>

    <div class="form-controls">
      <label>Month:</label>
      <input type="month" v-model="selectedMonth" />
      <button @click="addRow">➕ Add Row</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount (₹)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in budgetData" :key="index">
          <td><input v-model="item.category" placeholder="e.g., Rent, Chitfund" /></td>
          <td><input type="number" v-model.number="item.amount" /></td>
          <td><input v-model="item.status" placeholder="e.g., done/pending" /></td>
          <td>
            <button @click="removeRow(index)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="summary">
      <strong>Total Budget:</strong> ₹ {{ totalBudget }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const selectedMonth = ref(new Date().toISOString().slice(0, 7));
    const budgetData = ref([
      { category: 'rent + maid', amount: 22500, status: '' },
      { category: 'chitfund liability', amount: 5000, status: 'done' },
      { category: 'chitfund liability', amount: 10000, status: 'done' },
      { category: 'Mom Dad Expenses', amount: 10000, status: 'done' },
      { category: 'LIC', amount: 0, status: '' },
      { category: 'chitfund', amount: 10000, status: '' },
      { category: 'Personal Loan liability', amount: 29000, status: '' },
      { category: 'monthly expenses', amount: 15000, status: 'done' },
      { category: 'hospital for wife pregnancy', amount: 8000, status: '' }
    ]);

    const addRow = () => {
      budgetData.value.push({ category: '', amount: 0, status: '' });
    };

    const removeRow = (index) => {
      budgetData.value.splice(index, 1);
    };

    const totalBudget = computed(() => {
      return budgetData.value.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    });

    return {
      selectedMonth,
      budgetData,
      addRow,
      removeRow,
      totalBudget
    };
  }
};
</script>

<style>
.budget-container {
  max-width: 960px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

input[type="month"], input[type="number"], input[type="text"], input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
}

button:hover {
  background: #388e3c;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.summary {
  font-size: 1.1rem;
  text-align: right;
  color: #2c3e50;
}
</style>
