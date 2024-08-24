<template>
    <div>
        <CarSituationTable />
    </div>
</template>

<script lang="ts" setup>
import CarSituationTable from 'src/components/CarSituationTable.vue';
import { useRoute } from 'vue-router';

//se obtiene la ruta actual
const route = useRoute()

const idCar: number = typeof route.params.idCar === 'string' ? parseInt(route.params.idCar) : -1



</script>