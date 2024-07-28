<script setup>
const emit = defineEmits(['update'])

const props = defineProps({
  page: {
    type: String
  }
})

function updateValue() {
  emit('update', true)
}
</script>
<template>
  <div class="row mt-4">
    <div class="col-12">
      <div class="no-tasks">
        <i class="fas fa-plus-circle"></i>
        <p>
          Aún no hay {{ props.page === 'category' ? 'categorias' : 'tareas' }},
          <a href="#" v-on:click="updateValue()">Crear nueva tarea</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.no-tasks svg {
  font-size: 80px; /* Ajusta este valor para hacer el icono más grande */
  color: #b8b8b8;
  padding-bottom: 10px;
}
.no-tasks a {
  color: #00bfa6;
  text-decoration: none;
}
</style>
