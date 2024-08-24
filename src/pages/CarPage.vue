<template>
  <div>
    <CarTable v-show="!isRutaActualIsAlgunaRutaHija()"/>
    <router-view />
  </div>
</template>

<script setup>
import CarTable from 'src/components/CarTable.vue';
import { ref } from 'vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
const route = ref(useRoute())

watch(useRoute(), (newRoute)=>{
  route.value = newRoute
})

function isRutaActualIsAlgunaRutaHija () {
  return route.value.name === "Situación del Carro"
}


console.log("ruta actual " + route.fullPath)
</script>
