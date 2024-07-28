<script setup lang="ts">
import { apiRequest } from '@/utils'
import { onMounted, defineEmits, ref, watch, defineProps } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Props
const props = defineProps({
  task: {
    type: Object,
    default: () => null
  }
})

const users = ref([])
const categories = ref([])
const priorities = ref([])
const statuses = ref([])
const newCategory = ref('') // Ref para la nueva categoría
const showNewCategoryInput = ref(false) // Controla la visibilidad del input para la nueva categoría

const emit = defineEmits(['update', 'taskCreated'])

const form = ref({
  title: '',
  description: '',
  user: null,
  category: null,
  priority: null,
  dueDate: null,
  status: null
})

onMounted(async () => {
  try {
    const [usersResponse, categoriesResponse, prioritiesResponse, statusesResponse] =
      await Promise.all([
        apiRequest('get', '/users'),
        apiRequest('get', '/categories'),
        apiRequest('get', '/priorities'),
        apiRequest('get', '/statuses')
      ])

    users.value = usersResponse
    categories.value = categoriesResponse.categories
    priorities.value = prioritiesResponse
    statuses.value = statusesResponse

    if (props.task) {
      form.value.user = props.task.user?.id
      form.value.description = props.task?.description
      form.value.title = props.task.title

      form.value.category = props.task?.category?.id
      form.value.priority = props.task?.priority?.id
      form.value.dueDate = new Date(props.task.dueDate).toISOString().slice(0, 10)
      form.value.status = props.task?.status?.id
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error)
    toast.error('Hubo un error !', {
      autoClose: 1000
    })
  }
})

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      form.value = { ...newTask }
    }
  },
  { immediate: true } // Ejecuta el watch inmediatamente para asegurar que los valores iniciales estén configurados
)

const closePanel = () => {
  emit('update', false)
}

const addNewCategory = async () => {
  if (newCategory.value.trim()) {
    const newCat = newCategory.value.trim()
    try {
      const response = await apiRequest('post', '/categories', {
        name: newCat
      })
      categories.value.push(response)
      form.value.category = response.id
      newCategory.value = ''
      showNewCategoryInput.value = false
      toast.success('Nueva categoría añadida con éxito!', {
        autoClose: 1000
      })
    } catch (error) {
      console.error('Error al añadir la nueva categoría:', error)
      toast.error('Hubo un error al añadir la nueva categoría!', {
        autoClose: 1000
      })
    }
  }
}

async function submitForm() {
  const endpoint = props.task ? `/tasks/${props.task.id}` : '/tasks'
  const method = props.task ? 'put' : 'post'
  const response = await apiRequest(method, endpoint, form.value)

  toast.success('Procesado con éxito!', {
    autoClose: 1000
  })
  emit('taskCreated')
  closePanel()
}
</script>

<template>
  <div class="create-task-panel" id="createTaskPanel">
    <span class="close-btn" @click="closePanel">&times;</span>
    <h5>Crear tarea</h5>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="taskName">Nombre tarea</label>
        <input
          type="text"
          class="form-control"
          v-model="form.title"
          id="taskName"
          placeholder="Nombre Tarea"
          required
        />
      </div>
      <div class="form-group">
        <label for="taskDescription">Descripcion tarea</label>
        <input
          type="text"
          class="form-control"
          v-model="form.description"
          id="taskDescription"
          placeholder="Descripcion Tarea"
        />
      </div>
      <div class="form-group">
        <label for="taskResponsible">Responsable</label>
        <select class="form-control" v-model="form.user" id="taskResponsible">
          <option value="" disabled>Seleccionar responsable</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="taskCategory">Categoría</label>
        <select
          v-if="!showNewCategoryInput"
          class="form-control"
          v-model="form.category"
          id="taskCategory"
        >
          <option value="" disabled>Seleccionar categoría</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <button
          type="button"
          class="btn btn-link mt-2"
          v-if="!showNewCategoryInput"
          @click="showNewCategoryInput = !showNewCategoryInput"
        >
          Añadir
        </button>
      </div>
      <div v-if="showNewCategoryInput" class="form-group">
        <input
          type="text"
          class="form-control"
          v-model="newCategory"
          placeholder="Nueva categoría"
        />
        <button
          type="button"
          class="btn btn-primary mt-2"
          @click="showNewCategoryInput = !showNewCategoryInput"
        >
          Cancelar
        </button>
        <button type="button" class="btn btn-primary mt-2 mx-2" @click="addNewCategory">
          Guardar
        </button>
      </div>
      <div class="form-group">
        <label for="taskPriority">Nivel de prioridad</label>
        <select class="form-control" v-model="form.priority" id="taskPriority">
          <option value="" disabled>Seleccionar nivel de prioridad</option>
          <option v-for="priority in priorities" :key="priority.id" :value="priority.id">
            {{ priority.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="taskStatus">Estado</label>
        <select class="form-control" v-model="form.status" id="taskStatus">
          <option value="" disabled>Seleccionar estado</option>
          <option v-for="status in statuses" :key="status.id" :value="status.id">
            {{ status.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="taskDueDate">Fecha de entrega</label>
        <input
          type="date"
          v-model="form.dueDate"
          class="form-control"
          id="taskDueDate"
          placeholder="Seleccionar fecha de entrega"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Guardar tarea</button>
    </form>
  </div>
</template>

<style scoped>
.create-task-panel {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 1000;
  right: 0;
}

.create-task-panel .close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}
.create-task-panel h5 {
  margin-top: 20px;
}
.create-task-panel form {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px); /* Adjusted to fit within panel */
}
.create-task-panel form .form-group {
  margin-bottom: 15px;
}
.create-task-panel form label {
  font-weight: bold;
}
.create-task-panel form input,
.create-task-panel form select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
.create-task-panel form button {
  background-color: #007174;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  width: fit-content;
  margin-top: auto; /* Pushes the button to the bottom */
}
.create-task-panel form button:hover,
.create-task-panel form button:focus {
  background-color: #00bfa6;
}
</style>
