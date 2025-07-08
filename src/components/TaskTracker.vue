<template>
  <div class="container">
    <header>
      <img src="/logo.png" alt="Task Tracker Logo" class="logo" />
      <h1>Task Tracker</h1>
    </header>

    <!-- Task Form -->
    <section class="form">
      <input v-model="task.taskDescription" placeholder="Task Description" />
      <select v-model="task.status">
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input v-model="task.startTime" type="datetime-local" />
      <input v-model="task.endTime" type="datetime-local" />
      <input v-model="task.changedBy" placeholder="Changed By" />
      <button @click="isEditing ? updateTask() : addTask()">
        {{ isEditing ? 'Update' : 'Add' }}
      </button>
      <button v-if="isEditing" class="cancel" @click="cancelEdit">Cancel</button>
    </section>

    <!-- Search & Sort -->
    <div class="search-sort">
      <input v-model="search" class="search" placeholder="🔍 Search task..." />
      <select v-model="sortBy">
        <option value="status">Sort by Status</option>
        <option value="startTime">Sort by Start Time</option>
        <option value="endTime">Sort by End Time</option>
        <option value="taskDescription">Sort by Description</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>Changed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in paginatedTasks" :key="t.id">
            <td>{{ t.taskDescription }}</td>
            <td>{{ t.status }}</td>
            <td>{{ formatDate(t.startTime) }}</td>
            <td>{{ formatDate(t.endTime) }}</td>
            <td>{{ t.changedBy }}</td>
            <td>
              <button @click="startEdit(t)">✏️</button>
              <button @click="deleteTask(t.id)">🗑️</button>
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

export default {
  setup() {
    const task = reactive({
      id: null,
      taskDescription: '',
      status: 'pending',
      startTime: '',
      endTime: '',
      changedBy: ''
    });

    const tasks = ref([]);
    const API = 'https://dailyexpensetracker-459m.onrender.com/tasks'; // Replace with your deployed task API URL
    const isEditing = ref(false);
    const search = ref('');
    const sortBy = ref('startTime');
    const page = ref(1);
    const pageSize = 5;

    const loadTasks = async () => {
      const res = await fetch(API);
      const data = await res.json();
      tasks.value = data;
    };

    const filteredTasks = computed(() => {
      return tasks.value
        .filter(t => t.taskDescription.toLowerCase().includes(search.value.toLowerCase()))
        .sort((a, b) => {
          if (sortBy.value === 'status') return a.status.localeCompare(b.status);
          if (sortBy.value === 'taskDescription') return a.taskDescription.localeCompare(b.taskDescription);
          return new Date(a[sortBy.value]) - new Date(b[sortBy.value]);
        });
    });

    const totalPages = computed(() => Math.ceil(filteredTasks.value.length / pageSize));

    const paginatedTasks = computed(() => {
      const start = (page.value - 1) * pageSize;
      return filteredTasks.value.slice(start, start + pageSize);
    });

    const addTask = async () => {
      if (!task.taskDescription || !task.changedBy) return;
      await fetch(`${API}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      await loadTasks();
      clearTask();
    };

    const deleteTask = async (id) => {
      await fetch(`${API}/delete/${id}`, { method: 'DELETE' });
      await loadTasks();
    };

    const startEdit = (t) => {
      Object.assign(task, t);
      isEditing.value = true;
    };

    const updateTask = async () => {
      await fetch(`${API}/update-status/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      await loadTasks();
      cancelEdit();
    };

    const cancelEdit = () => {
      clearTask();
      isEditing.value = false;
    };

    const clearTask = () => {
      task.id = null;
      task.taskDescription = '';
      task.status = 'pending';
      task.startTime = '';
      task.endTime = '';
      task.changedBy = '';
    };

    const formatDate = (dt) => new Date(dt).toLocaleString();

    onMounted(loadTasks);

    return {
      task,
      addTask,
      deleteTask,
      updateTask,
      cancelEdit,
      startEdit,
      formatDate,
      isEditing,
      search,
      sortBy,
      page,
      totalPages,
      paginatedTasks
    };
  }
};
</script>

<style scoped>
/* reuse same styles from ExpenseTracker.vue */
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
.search-sort {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
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
