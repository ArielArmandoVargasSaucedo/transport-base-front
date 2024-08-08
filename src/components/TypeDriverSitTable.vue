<template>
  <div class="q-pa-md">
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Tipos de Situaciones de los Choferes"
      :rows="listTypeDriverSituations"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top-right>
        <q-input
          class="q-mr-md"
          v-if="showFilter"
          filled
          borderless
          dense
          debounce="300"
          v-model="filtersTypeDriverSit.nombre"
          placeholder="Buscar por Nombre"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          class="q-ml-sm"
          icon="filter_list"
          @click="showFilter = !showFilter"
          flat
        />
        <q-btn icon="add_circle"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense />
        </q-td>
      </template>
    </q-table>
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
  {
    name: 'Action',
    label: '',
    align: 'right',
    field: 'Action',
    sortable: true,
  }
];

interface FiltersTypeDriverSit {
  nombre: string;
}

// Se definen las variables reactivas del componente
const filtersTypeDriverSit: Ref<FiltersTypeDriverSit> = ref({
  nombre: '',
});
const showFilter = ref(false);
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
    console.log(listTypeDriverSituations.value);
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
