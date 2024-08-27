<template>
    <q-page padding>
        <DriverTable v-show="!isRutaActualIsAlgunaRutaHija()" />
        <router-view />
    </q-page>
</template>

<script setup>
import DriverTable from 'src/components/DriverTable.vue';
import { ref } from 'vue';
import { watch } from 'vue';
import { useRoute } from 'vue-router';


const route = ref(useRoute())

watch(useRoute(), (newRoute) => {
    route.value = newRoute
})

function isRutaActualIsAlgunaRutaHija() {
    return route.value.name === "Situación del Chofer"
}


console.log("ruta actual " + route.fullPath)
</script>