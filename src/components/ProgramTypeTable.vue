<template>
  <div class="q-pa-md">
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'"
      :title="$t('tipoProgramacion.tiposProgramacion')" :rows="listProgramsType" :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersProgramType.nombre" :placeholder="$t('tipoProgramacion.buscarNombre')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarModalTypeProgram()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense @click="activarModalTypeProgram(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activarModalConfirmacion(props.row.id_aut_prog_type)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalTypeProgram :type-reactivo="typeProgramReactivo" ref="modalTypeProgram" @post-type-program="postTypeProgram"
      @update-type-program="updateTypeProgram" />
    <ModalConfirmacion ref="modalConfirmacion" :text="$t('tipoProgramacion.confirmacionEliminar')"
      @action-confirm="deleteTypeProgram" />
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
import { BadRequestError } from 'src/utils/BadRequestError';
import { useI18n } from 'vue-i18n';

// Inyectar el Servicio de Program Type

const programTypesService: ProgramTypesService =
  ProgramTypesService.getInstancie();
const { t, locale } = useI18n(); // Importa la función de traduccion

// se define un watch para observar los cambios de locale (lo que representa al idioma actual)
watch(locale /* locale representa el valor de la internacionalización */, () => {
  // se asignan los nuevos valores de la función t
  columns.value = [
    {
      name: 'nombre',
      label: t('tipoProgramacion.nombre'),
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
})

// Columnas de la tabla
const columns = ref([
  {
    name: 'nombre',
    label: t('tipoProgramacion.nombre'),
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
]);


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

const typeProgramReactivo: Ref<{
  typeSeleccionado?: ProgramTypeDTO,
}> = ref({
  typeSeleccionado: undefined
})

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
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }
}

async function postTypeProgram(nombre: string) {
  try {
    await programTypesService.postTypeProgram(nombre);
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
    modalTypeProgram.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof Error)
      Notify.create({
        message: error.message,
        type: 'negative', // Cambia el tipo a 'negative', 'warning', 'info', etc.
        color: 'red', // Cambia el color de la notificación
        position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
        timeout: 3000, // Cambia la duración de la notificación en milisegundos
        icon: 'cancel', // Añade un icono a la notificación
      });
  }
}
async function deleteTypeProgram() {
  try {
    await programTypesService.deleteTypeProgram(idTypeProgramSeleccionado);
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
        icon: 'cancel', // Añade un icono a la notificación
      });
  }
}

async function updateTypeProgram(id: number, nombre: string) {
  try {
    await programTypesService.updateTypeProgram(id, nombre)
    // se notifica de la acción
    Notify.create({
      message: 'Tipo de Situación del Chofer insertada con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se actualiza la información
    await actualizarProgramTypes();
    // se cierra el modal
    modalTypeProgram.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof Error)
      Notify.create({
        message: error.message,
        type: 'negative', // Cambia el tipo a 'negative', 'warning', 'info', etc.
        color: 'red', // Cambia el color de la notificación
        position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
        timeout: 3000, // Cambia la duración de la notificación en milisegundos
        icon: 'cancel', // Añade un icono a la notificación
      });
  }
}

// eventos del componente
function activarModalTypeProgram(typeProgramSituationDTO?: ProgramTypeDTO) {
  // activar el modal
  typeProgramReactivo.value.typeSeleccionado = typeProgramSituationDTO
  modalTypeProgram.value?.setShowModal(true);
}

function activarModalConfirmacion(idPro: number) {
  idTypeProgramSeleccionado = idPro;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
