<script setup>
import CreateTask from './components/task/CreateTask.vue'
import CreateCategory from './components/category/CreateCategory.vue'
import TaskList from './components/task/TaskList.vue'
import CategoryList from './components/category/CategoryList.vue'
import NoData from './components/NoData.vue'
import { onMounted, ref, watch } from 'vue'
import 'vue3-toastify/dist/index.css'
import { apiRequest } from './utils'

const tasks = ref([])
const categories = ref([])

const search = ref('')
const noTask = ref(true)
const noCategories = ref(true)
const total = ref(0)
const totalCategories = ref(0)

const taskToEdit = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(5)

const currentPageCategories = ref(1)
const itemsPerPageCategories = ref(5)

let modalActive = ref(false)
const categoryToEdit = ref(null)

let modalCategoryActive = ref(false)

const page = ref('task')

onMounted(async () => {
  await getTask()
  await getCategories()
})

watch([currentPage, itemsPerPage], async () => {
  await getTask()
})

watch([currentPageCategories, itemsPerPageCategories], async () => {
  await getCategories()
})

function handleEditTask(task) {
  taskToEdit.value = task
  modalActive.value = true
}

function handleEditCategory(category) {
  categoryToEdit.value = category
  modalCategoryActive.value = true
}

function handleTaskCreated() {
  modalActive.value = false
  taskToEdit.value = null
  getTask()
}

function handleCategoryCreated() {
  modalCategoryActive.value = false
  getCategories()
}

function handleClosePanel() {
  modalActive.value = false
  taskToEdit.value = null
}
const setPage = (newPage) => {
  page.value = newPage
}

const getTask = async () => {
  const response = await apiRequest('get', '/tasks', null, {
    page: currentPage.value,
    limit: itemsPerPage.value
  })
  tasks.value = response.tasks
  total.value = response.total

  if (response.tasks.length > 0) {
    noTask.value = false
  } else {
    noTask.value = true
  }
}

const getCategories = async () => {
  const response = await apiRequest('get', '/categories', null, {
    page: currentPageCategories.value,
    limit: itemsPerPageCategories.value
  })
  categories.value = response.categories
  totalCategories.value = response.total
  if (response.categories.length > 0) {
    noCategories.value = false
  } else {
    noCategories.value = true
  }
}

function handleUpdate(newValue) {
  modalActive.value = newValue
  taskToEdit.value = null
}

const searchFunction = async (type) => {
  if (type === 'task') {
    if (search.value.trim()) {
      let response = await apiRequest('get', `/tasks?search=${search.value.trim()}`)
      tasks.value = response.tasks
      total.value = response.total
    } else {
      await getTask()
    }
  } else {
    if (search.value.trim()) {
      let response = await apiRequest('get', `/categories?search=${search.value.trim()}`)
      categories.value = response.categories
      totalCategories.value = response.total
    } else {
      await getCategories()
    }
  }
}

// Nueva función para abrir el modal de categoría desde CategoryList
const handleUpdateCategory = (newValue) => {
  modalCategoryActive.value = newValue
  categoryToEdit.value = null
}
</script>

<template>
  <div class="container mt-5">
    <div class="header">
      <div>
        <h2>Gestión de Tareas Diarias</h2>
        <p>Crea, revisa y gestiona tus tareas diarias de manera eficiente</p>
      </div>
      <div class="user-icon">
        <button class="btn btn-outline-secondary rounded-circle">GD</button>
      </div>
    </div>
    <div class="row mt-4">
      <div v-if="page === 'task'">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h5>Lista de tareas ({{ total }})</h5>
          <div class="search-create w-50">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar"
              v-model="search"
              @keyup="searchFunction('task')"
            />
            <button class="btn create-task-btn" v-on:click="handleUpdate(true)">
              <i class="fas fa-plus-circle px-1"></i>Crear tarea
            </button>
          </div>
        </div>
      </div>
      <div v-if="page === 'category'">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h5>Lista de categorias ({{ totalCategories }})</h5>
          <div class="search-create w-50">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar"
              v-model="search"
              @keyup="searchFunction('category')"
            />
            <button class="btn create-task-btn" v-on:click="handleUpdateCategory(true)">
              <i class="fas fa-plus-circle px-1"></i>Crear categoria
            </button>
          </div>
        </div>
      </div>
    </div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: page === 'task' }"
          aria-current="page"
          @click="setPage('task')"
        >
          Tareas
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: page === 'category' }"
          @click="setPage('category')"
        >
          Categorías
        </button>
      </li>
    </ul>

    <div v-if="page === 'task'">
      <TaskList
        v-if="!noTask"
        :tasks="tasks"
        :total="total"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        @editTask="handleEditTask"
        @update:current-page="currentPage = $event"
        @update:items-per-page="itemsPerPage = $event"
        @taskDeleted="getTask"
      />
      <NoData v-if="noTask" @update="handleUpdate" :page="page" />
    </div>

    <div v-if="page === 'category'">
      <CategoryList
        v-if="!noCategories"
        :categories="categories"
        :total="totalCategories"
        :current-page="currentPageCategories"
        :items-per-page="itemsPerPageCategories"
        @editCategory="handleEditCategory"
        @update:current-page="currentPageCategories = $event"
        @update:items-per-page="itemsPerPageCategories = $event"
        @categoryDelete="getCategories"
      />
      <NoData v-if="noCategories" @update="handleUpdateCategory" :page="page" />
    </div>
  </div>

  <CreateTask
    v-if="modalActive"
    :task="taskToEdit"
    @update="handleClosePanel"
    @taskCreated="handleTaskCreated"
  />

  <CreateCategory
    v-if="modalCategoryActive"
    :category="categoryToEdit"
    @update="handleUpdateCategory(false)"
    @categoryCreated="handleCategoryCreated"
  />
</template>

<style scoped>
body {
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header h2 {
  margin: 0;
}
.header p {
  margin: 0;
  color: #888;
}
.search-create {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
.search-create input {
  max-width: 300px;
  margin-right: 10px;
}

.create-task-btn {
  background-color: #007174;
  color: #fff;
  border: none;
}
.create-task-btn:hover,
.create-task-btn:focus,
.create-task-btn:active {
  background-color: #00bfa6;
  color: #fff;
  border: none;
  outline: none;
  box-shadow: none;
}
.no-tasks {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 50px;
  background-color: #f9f9f9;
  margin-top: 30px;
}
.no-tasks a {
  color: #00bfa6;
  text-decoration: none;
}
</style>
