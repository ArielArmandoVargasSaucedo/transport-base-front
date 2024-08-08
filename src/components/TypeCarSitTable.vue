<template>
  <div class="q-pa-md">
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Tipos de Situaciones de los Carros"
      :rows="listTypesCarSituations"
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
          v-model="filtersTypeCarSit.nombre"
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
        <q-btn icon="add_circle" @click="activarModalTypeCarSit()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense @click="deleteTypeCarSituations(props.row.id_aut_type_cs)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalTypeCarSit
      ref="modalTypeCarSit"
      @post-type-car-situations="postTypeCarSituations"
    />
  </div>
</template>

<script lang="ts" setup>
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { Ref, onMounted, ref } from 'vue';
import ModalTypeCarSit from './Modales/ModalTypeCarSit.vue';

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
  {
    name: 'Action',
    label: '',
    align: 'right',
    field: 'Action',
    sortable: true,
  },
];

interface FiltersTypeCarSit {
  nombre: string;
}

// se crea una variable para el modal
const modalTypeCarSit: Ref<InstanceType<typeof ModalTypeCarSit> | null> =
  ref(null);
// Se definen las variables reactivas del componente
const filtersTypeCarSit: Ref<FiltersTypeCarSit> = ref({
  nombre: '',
});

const showFilter = ref(false);
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

async function postTypeCarSituations(nombre: string) {
  try {
    await typeCarSistuationService.postTypeCarSituation(nombre);
    // se actualiza la información
    await actualizarTypeCarSituations();
    // se cierra el modal
    modalTypeCarSit.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof Error) alert(error.message);
  }
}
async function deleteTypeCarSituations(id:number) {
  try {
     await typeCarSistuationService.deleteTypeCarSituation(id)
     // se actualiza la información
     await actualizarTypeCarSituations();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

// eventos del componente
function activarModalTypeCarSit() {
  // activar el modal
  modalTypeCarSit.value?.setShowModal(true);
}
</script>

<style></style>
