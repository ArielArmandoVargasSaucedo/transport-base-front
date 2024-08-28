<template>
  <div class="q-pa-md">
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Tipos de Situaciones de los Carros"
      :rows="listTypesCarSituations" :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersTypeCarSit.nombre" placeholder="Buscar por Nombre">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarModalTypeCarSit()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense @click="activarModalTypeCarSit(props.row)"/>
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activarModlConfirmacion(props.row.id_aut_type_cs)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalTypeCarSit :type-reactivo="typeCarReactivo" ref="modalTypeCarSit" @post-type-car-situations="postTypeCarSituations" @update-type-car-situations="updateTypeCarSituations"/>

    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'"
      @action-confirm="deleteTypeCarSituations" />
  </div>
</template>

<script lang="ts" setup>
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { Ref, onMounted, ref, watch } from 'vue';
import ModalTypeCarSit from './Modales/ModalTypeCarSit.vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';

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
    name: 'fecha',
    label: 'Tiene fecha de retorno?',
    align: 'left',
    field: (row: TypeCarSituationDTO) => row.is_return ? 'Si' : 'No',
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
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// Se definen las variables reactivas del componente
const filtersTypeCarSit: Ref<FiltersTypeCarSit> = ref({
  nombre: '',
});

const typeCarReactivo: Ref<{
  typeSeleccionado?: TypeCarSituationDTO,
}> = ref({
  typeSeleccionado: undefined
})

// Se define uun watch para los filtros
watch(filtersTypeCarSit.value, async (newFilters: FiltersTypeCarSit) => {
  await getTypeCarSituations()
})

const showFilter = ref(false);
const listTypesCarSituations: Ref<Array<TypeCarSituationDTO>> = ref(
  new Array<TypeCarSituationDTO>()
);
// representa el indentificador del elemento q se desea eliminar
let idTipoSitCarSeleccionado = 0;

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

async function postTypeCarSituations(nombre: string, is_fecha: boolean) {
  try {
    await typeCarSistuationService.postTypeCarSituation(nombre,is_fecha);
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
    await actualizarTypeCarSituations();
    // se cierra el modal
    modalTypeCarSit.value?.setShowModal(false);
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
async function deleteTypeCarSituations() {
  try {
    await typeCarSistuationService.deleteTypeCarSituation(idTipoSitCarSeleccionado);
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
    await actualizarTypeCarSituations();
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

async function updateTypeCarSituations(id: number, nombre: string) {
    try {
      await typeCarSistuationService.updateTypeCarSituation(id, nombre)
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
      await actualizarTypeCarSituations();
      // se cierra el modal
      modalTypeCarSit.value?.setShowModal(false);
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
function activarModalTypeCarSit(typeCarSituationDTO?: TypeCarSituationDTO) {
  // activar el modal
  typeCarReactivo.value.typeSeleccionado = typeCarSituationDTO
  modalTypeCarSit.value?.setShowModal(true);
}

function activarModlConfirmacion(idSitCar: number) {
  idTipoSitCarSeleccionado = idSitCar;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
