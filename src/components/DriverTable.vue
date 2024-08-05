<template>
  <div class="q-pa-md">
    <q-table
      title="Drivers"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup lang="ts">
import { DriversService } from 'src/logica/drivers/DriversService';

// Inyectar el Servicio de los Drivers
const driversService: DriversService = DriversService.getInstancie()



const columns = [
  {
    name: 'dni',
    required: true,
    label: 'dbi',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'name',
    label: 'nombre',
    align: 'left',
    field: (row) => row.name,
    sortable: true,
  },
];
const rows = [
  {
    name: 'talia',
  },
];
</script>
