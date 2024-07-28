<script setup lang="ts">
import { apiRequest } from '@/utils'
import { ref, computed, defineProps, defineEmits } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// Define props para recibir las tareas y parámetros de paginación del componente padre
const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['editTask', 'update:currentPage', 'update:itemsPerPage', 'taskDeleted'])

const getPriorityClass = (priority: string) => {
  if (typeof priority !== 'string') return ''
  switch (priority.toLowerCase()) {
    case 'alta':
      return 'priority-label alta'
    case 'media':
      return 'priority-label media'
    case 'baja':
      return 'priority-label baja'
    default:
      return ''
  }
}

const getStatusClass = (status: string) => {
  if (typeof status !== 'string') return ''
  switch (status.toLowerCase()) {
    case 'atrasada':
      return 'status-label atrasada'
    case 'entregada':
      return 'status-label entregada'
    case 'en curso':
      return 'status-label en-curso'
    default:
      return ''
  }
}

const editTask = (task) => {
  emit('editTask', task)
}
const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const selectedTask = ref(null)

const showModal = ref(false)

const confirmDelete = (task) => {
  selectedTask.value = task
  showModal.value = true
}

const deleteTask = async () => {
  if (selectedTask.value) {
    try {
      const response = await apiRequest('DELETE', `/tasks/${selectedTask.value.id}`)

      toast.success('Correctamente eliminada!', {
        autoClose: 1000
      })

      showModal.value = false
      emit('taskDeleted', selectedTask.value)
      selectedTask.value = null
    } catch (error) {
      console.error(`Error deleting task: ${error}`)
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Los meses van de 0 a 11
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

const updateCurrentPage = (newPage: number) => {
  emit('update:currentPage', newPage)
}

const updateItemsPerPage = (newItemsPerPage: number) => {
  emit('update:itemsPerPage', parseInt(newItemsPerPage))
}
</script>

<template>
  <div class="row mt-4">
    <div class="col-12 table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tarea</th>
            <th>Descripcion</th>
            <th>Responsable</th>
            <th>Categoría</th>
            <th>Nivel de prioridad</th>
            <th>Fecha de entrega</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="tasks.length === 0">
            <td colspan="8">Sin datos</td>
          </tr>
          <tr v-for="(task, index) in tasks" :key="index">
            <td>{{ task.id }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task?.description }}</td>
            <td>{{ task?.user?.name }}</td>
            <td>{{ task?.category?.name }}</td>
            <td>
              <span :class="getPriorityClass(task?.priority?.name)">{{
                task?.priority?.name
              }}</span>
            </td>
            <td>{{ formatDate(task.dueDate) }}</td>
            <td>
              <span :class="getStatusClass(task?.status?.name)">{{ task?.status?.name }}</span>
            </td>
            <td>
              <div class="dropdown">
                <button
                  class="btn btn-outline-secondary btn-sm dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button class="dropdown-item" @click="editTask(task)">Editar</button>
                  </li>
                  <li>
                    <button class="dropdown-item" @click="confirmDelete(task)">Eliminar</button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="row mt-4">
    <div class="col-6">
      <div class="form-group">
        <label for="itemsPerPage">Mostrando</label>
        <select
          v-bind:value="props.itemsPerPage"
          @change="updateItemsPerPage($event.target.value)"
          class="mx-1"
          id="itemsPerPage"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        registros.
      </div>
    </div>

    <div class="col-6 d-flex justify-content-end align-items-center">
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: props.currentPage <= 1 }">
            <button
              class="page-link"
              @click="updateCurrentPage(props.currentPage - 1)"
              :disabled="props.currentPage === 1"
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </li>
          <li class="page-item">
            <input
              type="number"
              v-bind:value="props.currentPage"
              @input="updateCurrentPage($event.target.value)"
              min="1"
              :max="props.total"
              style="width: 50px; text-align: center"
            />
            de
            <span>{{ totalPages }}</span>
            páginas
          </li>
          <li class="page-item" :class="{ disabled: props.currentPage === totalPages }">
            <button
              class="page-link"
              @click="updateCurrentPage(props.currentPage + 1)"
              :disabled="props.currentPage === props.total"
            >
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-warning-icon">&#9888;</span>
        <h4 class="modal-title">Advertencia</h4>
      </div>
      <div class="modal-body">
        <p>¿Está seguro de que desea eliminar esta tarea? Esta acción no puede deshacerse.</p>
        <div class="modal-task-details">
          <div><strong>Tarea:</strong> {{ selectedTask?.title }}</div>
          <div><strong>Responsable:</strong> {{ selectedTask?.user.name }}</div>
          <div><strong>Categoría:</strong> {{ selectedTask?.category.name }}</div>
          <div><strong>Fecha de entrega:</strong> {{ formatDate(selectedTask?.dueDate) }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="showModal = false">Salir</button>
        <button class="btn btn-danger" @click="deleteTask">Eliminar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
  background-color: #00bfa6;
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
.table-responsive {
  overflow-x: visible;
}
@media (max-width: 768px) {
  .table-responsive {
    width: 100%;
    overflow-x: auto;
  }
}
.table th,
.table td {
  vertical-align: middle;
}

.status-label {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  color: #fff;
}

.status-label.atrasada {
  color: #dc1670;
  background-color: #ffedf5;
}

.status-label.entregada {
  background-color: #edfffd;
  color: #0b8778;
}

.status-label.en-curso {
  background-color: #f0f6ff;
  color: #1c6de6;
}

.priority-label {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  color: #fff;
}

.priority-label.alta {
  background-color: #f5222d;
}

.priority-label.media {
  background-color: #faad14;
}

.priority-label.baja {
  background-color: #1890ff;
}

/* Estilos para la paginación */
.pagination {
  display: flex;
  list-style: none;
  padding-left: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  color: #00bfa6;
  border: none;
  background: none;
}

.page-link:disabled {
  color: #ccc;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

.page-item.active .page-link {
  font-weight: bold;
  color: #00bfa6;
}
/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.modal-warning-icon {
  font-size: 24px;
  color: #f5c518;
  margin-right: 10px;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.modal-body {
  margin-bottom: 15px;
}

.modal-task-details {
  margin-top: 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-footer button {
  margin-left: 10px;
}
</style>
