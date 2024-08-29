<template>
  <q-page class="row items-center justify-evenly container">
    <example-component title="Example component" active :todos="todos" :meta="meta"></example-component>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Todo, Meta } from 'components/models';

defineOptions({
  name: 'IndexPage'
});

const todos = ref<Todo[]>([
  // Inicializa aquí tus tareas
]);

const meta = ref<Meta>({
  totalCount: 1200
});
</script>

<style scoped>
.container {
  background-image: url("src/images/pantalla_principal.jpg");
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
