<template>
  <div class="q-pa-md">
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Tipos de Programaciones"
      :rows="listProgramsType"
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
          v-model="filtersProgramType.nombre"
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
        <q-btn icon="add_circle" @click="activarModalTypeProgram()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense />
        </q-td>
      </template>
    </q-table>
    <ModalTypeProgram
      ref="modalTypeProgram"
      @post-type-program="postTypeProgram"
    />
  </div>
</template>

<script lang="ts" setup>
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { ProgramTypesService } from 'src/logica/programTypes/ProgramTypesService';
import { Ref, onMounted, ref } from 'vue';
import ModalTypeProgram from './Modales/ModalTypeProgram.vue';
import { watch } from 'vue';

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
  },
];

interface FiltersProgramType {
  nombre: string;
}

// Se definen las variables reactivas del componente
const filtersProgramType: Ref<FiltersProgramType> = ref({
  nombre: '',
});

// se crea una variable para el modal
const modalTypeProgram: Ref<InstanceType<typeof ModalTypeProgram> | null> =
  ref(null);
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// Se definen las variables reactivas del componente
const filtersTypeProgram: Ref<FiltersProgramType> = ref({
  nombre: '',
});

// Se define uun watch para los filtros
watch(filtersTypeProgram.value, async (newFilters: FiltersProgramType) => {
  await getProgramTypes();
});

const showFilter = ref(false);

const listProgramsType: Ref<Array<ProgramTypeDTO>> = ref(
  new Array<ProgramTypeDTO>()
);

// representa el indentificador del elemento q se desea eliminar
let idTypeProgramSeleccionado = 0;

onMounted(actualizarProgramTypes);

async function actualizarProgramTypes() {
  await getProgramTypes();
}

// Funciones CRUD
async function getProgramTypes() {
  try {
    listProgramsType.value = await programTypesService.getProgramTypes();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

async function postTypeProgram(nombre: string) {
  try {
    //  await programTypesService.postTypeProgram(nombre);
    // se notifica de la acción
    Notify.create({
      message: 'Tipo de Situación del Carro insertada con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se actualiza la información
    await actualizarProgramTypes();
    // se cierra el modal
    ModalTypeProgram.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof Error)
      Notify.create({
        message: error.message,
        type: 'negative', // Cambia el tipo a 'negative', 'warning', 'info', etc.
        color: 'red', // Cambia el color de la notificación
        position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
        timeout: 3000, // Cambia la duración de la notificación en milisegundos
        icon: 'check_circle', // Añade un icono a la notificación
      });
  }
}
async function deleteTypeProgram() {
  try {
    // await programTypesService.deleteTypeProgram(idTypeProgramSeleccionado);
    // se notifica de la acción
    Notify.create({
      message: 'Se ha elimnado con éxito el Tipo de Situación del Carro',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se actualiza la información
    await actualizarProgramTypes();
  } catch (error) {
    if (error instanceof Error)
      Notify.create({
        message: error.message,
        type: 'negative', // Cambia el tipo a 'negative', 'warning', 'info', etc.
        color: 'red', // Cambia el color de la notificación
        position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
        timeout: 3000, // Cambia la duración de la notificación en milisegundos
        icon: 'check_circle', // Añade un icono a la notificación
      });
  }
}

// eventos del componente
function activarModalTypeProgram() {
  // activar el modal
  //  modalTypeProgram.value?.setShowModal(true);
}

function activarModlConfirmacion(idPro: number) {
  idTypeProgramSeleccionado = idPro;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
