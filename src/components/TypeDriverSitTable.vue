<template>
  <div class="q-pa-md">
    <q-table
      title="TypeDriverSituations"
      :rows="listTypeDriverSituations"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script lang="ts" setup>
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los TypeDriverSituations

const typeDriverSituationsService: TypeDriverSituationsService =
  TypeDriverSituationsService.getInstancie();

const columns = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: TypeDriverSituationDTO) => row.type_ds_name,
    sortable: true,
  },
];

// Se definen las variables reactivas del componente
const listTypeDriverSituations: Ref<Array<TypeDriverSituationDTO>> = ref(
  new Array<TypeDriverSituationDTO>()
);

onMounted(actualizarTypeDriverSituations);

async function actualizarTypeDriverSituations() {
  await getTypeDriverSituations();
}

// Funciones CRUD
async function getTypeDriverSituations() {
  try {
    listTypeDriverSituations.value =
      await typeDriverSituationsService.getTypeDriverSituations();
      console.log(listTypeDriverSituations.value)
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
