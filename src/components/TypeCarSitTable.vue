<template>
  <div class="q-pa-md">
    <q-table
      title="Drivers"
      :rows="listTypesCarSituations"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script lang="ts" setup>
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los Type Car Situations

const typeCarSistuationService: TypeCarSituationsService =
  TypeCarSituationsService.getInstancie();

const columns = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: TypeCarSituationDTO) => row.type_cs_name,
    sortable: true,
  },
];

// Se definen las variables reactivas del componente
const listTypesCarSituations: Ref<Array<TypeCarSituationDTO>> = ref(
  new Array<TypeCarSituationDTO>()
);

onMounted(actualizarTypeCarSituations);

async function actualizarTypeCarSituations() {
  await getTypeCarSituations();
}

// Funciones CRUD
async function getTypeCarSituations() {
  try {
    listTypesCarSituations.value =
      await typeCarSistuationService.getTypeCarSituations();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
