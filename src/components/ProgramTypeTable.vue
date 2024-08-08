<template>
  <div class="q-pa-md">
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Tipos de Programaciones" :rows="listProgramsType"
            :columns="columns" row-key="id">
            <template v-slot:top-right>

                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersProgramType.nombre" placeholder="Buscar por Nombre">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
                <q-btn icon="add_circle" ></q-btn>
            </template>

            <template v-slot:body-cell-Action="props">
                <q-td :props="props">
                    <q-btn icon="edit" size="sm" flat dense
                        />
                    <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
                         />
                </q-td>
            </template>
        </q-table>
  </div>
</template>

<script lang="ts" setup>
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';

import { ProgramTypesService } from 'src/logica/programTypes/ProgramTypesService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los Drivers

const programTypesService: ProgramTypesService =
  ProgramTypesService.getInstancie();

const columns = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: ProgramTypeDTO) => row.prog_type_name,
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

interface FiltersProgramType {
  nombre: string
}

// Se definen las variables reactivas del componente
const filtersProgramType: Ref<FiltersProgramType> = ref({
  nombre: ''
})
const showFilter = ref(false)

const listProgramsType: Ref<Array<ProgramTypeDTO>> = ref(new Array<ProgramTypeDTO>());

onMounted(actualizarProgramTypes);

async function actualizarProgramTypes() {
  await getProgramTypes();
}

// Funciones CRUD
async function getProgramTypes() {
  try {
    listProgramsType.value = await programTypesService.getProgramTypes()
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}
</script>

<style></style>
