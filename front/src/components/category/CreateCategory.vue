<script setup lang="ts">
import { apiRequest } from '@/utils'
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Props
const emit = defineEmits(['update', 'categoryCreated'])
const props = defineProps({
  category: {
    type: Object,
    default: () => null
  }
})

const newCategory = ref('') // Ref para la nueva categoría
const showNewCategoryInput = ref(false) // Controla la visibilidad del input para la nueva categoría

const form = ref({
  name: '',
  created_at: ''
})
console.log('props', props)

const closePanel = () => {
  emit('update', false)
}

onMounted(async () => {
  console.log('PROPS', props.category)

  if (props.category) {
    form.value.name = props.category.name
  }
})

const addNewCategory = async () => {
  console.log('newCategory', form.value)

  if (form.value.name.trim()) {
    const newCat = {
      name: form.value.name.trim()
    }
    try {
      const endpoint = props.category ? `/categories/${props.category.id}` : '/categories'
      const method = props.category ? 'put' : 'post'
      console.log({ method, endpoint, newCat })

      const response = await apiRequest(method, endpoint, newCat)

      form.value.name = ''

      showNewCategoryInput.value = false
      toast.success(
        props.category ? 'Categoría actualizada con éxito!' : 'Nueva categoría añadida con éxito!',
        {
          autoClose: 1000
        }
      )
      emit('categoryCreated')
      closePanel()
    } catch (error) {
      console.error('Error al añadir la nueva categoría:', error)
      toast.error('Hubo un error al añadir la nueva categoría!', {
        autoClose: 1000
      })
    }
  }
}
</script>

<template>
  <div class="create-category-panel" id="createCategoryPanel">
    <span class="close-btn" @click="closePanel">&times;</span>
    <h5>{{ props.category ? 'Actualizar' : 'Crear' }} Categoría</h5>
    <form @submit.prevent="addNewCategory">
      <div class="form-group">
        <label for="categoryName">Nombre categoría</label>
        <input
          type="text"
          class="form-control"
          v-model="form.name"
          id="categoryName"
          placeholder="Nombre Categoría"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">
        {{ props.category ? 'Actualizar' : 'Guardar' }} categoría
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-category-panel {
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

.create-category-panel .close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}
.create-category-panel h5 {
  margin-top: 20px;
}
.create-category-panel form {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px); /* Adjusted to fit within panel */
}
.create-category-panel form .form-group {
  margin-bottom: 15px;
}
.create-category-panel form label {
  font-weight: bold;
}
.create-category-panel form input,
.create-category-panel form select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
.create-category-panel form button {
  background-color: #007174;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  width: fit-content;
}
.create-category-panel form button:hover,
.create-category-panel form button:focus {
  background-color: #00bfa6;
}
</style>
