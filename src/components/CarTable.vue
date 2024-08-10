<template>
  <div class="q-pa-md">
    <q-table title="Cars" :rows="listCars" :columns="columns" row-key="name" />
  </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los Drivers

const carsService: CarsService = CarsService.getInstancie();

const columns = [
  {
    name: 'number',
    required: true,
    label: 'Number',
    align: 'left',
    field: (row: CarDTO) => row.car_number,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'brand',
    label: 'Brand',
    align: 'left',
    field: (row: CarDTO) => row.car_brand,
    sortable: true,
  },
  {
    name: 'number_of_Seats',
    label: 'Seats',
    align: 'left',
    field: (row: CarDTO) => row.number_of_seats,
    sortable: true,
  },
];

// Se definen las variables reactivas del componente
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());

onMounted(actualizarCars);

async function actualizarCars() {
  await getCars();
}

// Funciones CRUD
async function getCars() {
  try {
    listCars.value = await carsService.getCars();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
