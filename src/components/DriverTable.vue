<template>
  <div class="q-pa-md">
    <q-table title="Drivers" :rows="listDrivers" :columns="columns" row-key="name" />
  </div>
</template>

<script lang="ts" setup>
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los Drivers

const driversService: DriversService = DriversService.getInstancie();

const columns = [
  {
    name: 'dni',
    required: true,
    label: 'Dni',
    align: 'left',
    field: (row: DriverDTO) => row.dni_driver,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: DriverDTO) => row.driver_name,
    sortable: true,
  },
  {
    name: 'direccion',
    label: 'Dirección',
    align: 'left',
    field: (row: DriverDTO) => row.home_address,
    sortable: true,
  },
];

// Se definen las variables reactivas del componente
const listDrivers: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());

  onMounted(actualizarDrivers)

async function actualizarDrivers() {
  await getDrivers()
}

// Funciones CRUD
async function getDrivers() {
  try {
    listDrivers.value = await driversService.getDrivers();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
