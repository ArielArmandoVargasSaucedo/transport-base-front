<template>
  <div class="q-pa-md">
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'"
      :title="$t('tipoSituacionesChofer.tiposSituacionesChofer')" :rows="listTypesDriverSituations" :columns="columns"
      row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersTypeDriverSit.nombre" :placeholder="$t('tipoSituacionesChofer.buscarNombre')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarModalTypeDriverSit()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense @click="activarModalTypeDriverSit(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activarModalConfirmacion(props.row.id_aut_type_ds)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalTypeDriverSit :type-reactivo="typeDriverReactivo" ref="modalTypeDriverSit"
      @post-type-driver-situations="postTypeDriverSituations"
      @update-type-driver-situations="updateTypeDriverSituations" />

    <ModalConfirmacion ref="modalConfirmacion" :text="$t('tipoSituacionesChofer.confirmacionEliminar')"
      @action-confirm="deleteTypeDriverSituations" />
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch } from 'vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import ModalTypeDriverSit from './Modales/ModalTypeDriverSit.vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import { useI18n } from 'vue-i18n';

// Inyectar el Servicio de los Type Car Situations

const typeDriverSistuationService: TypeDriverSituationsService =
  TypeDriverSituationsService.getInstancie();

const { t, locale } = useI18n(); // Importa la función de traduccion

// se define un watch para observar los cambios de locale (lo que representa al idioma actual)
watch(locale /* locale representa el valor de la internacionalización */, () => {
  columns.value = [
    {
      name: 'nombre',
      label: t('tipoSituacionesChofer.nombre'),
      align: 'left',
      field: (row: TypeDriverSituationDTO) => row.type_ds_name,
      sortable: true,
    },
    {
      name: 'fecha',
      label: t('tipoSituacionesChofer.tieneFechaRetorno'),
      align: 'left',
      field: (row: TypeDriverSituationDTO) => row.is_return ? 'Si' : 'No',
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
    label: t('tipoSituacionesChofer.nombre'),
    align: 'left',
    field: (row: TypeDriverSituationDTO) => row.type_ds_name,
    sortable: true,
  },
  {
    name: 'fecha',
    label: t('tipoSituacionesChofer.tieneFechaRetorno'),
    align: 'left',
    field: (row: TypeDriverSituationDTO) => row.is_return ? 'Si' : 'No',
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


interface FiltersTypeDriverSit {
  nombre: string;
}

// se crea una variable para el modal
const modalTypeDriverSit: Ref<InstanceType<typeof ModalTypeDriverSit> | null> =
  ref(null);
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// Se definen las variables reactivas del componente
const filtersTypeDriverSit: Ref<FiltersTypeDriverSit> = ref({
  nombre: '',
});

const typeDriverReactivo: Ref<{
  typeSeleccionado?: TypeDriverSituationDTO,
}> = ref({
  typeSeleccionado: undefined
})

// Se define uun watch para los filtros
watch(filtersTypeDriverSit.value, async (newFilters: FiltersTypeDriverSit) => {
  await getTypeDriverSituations()
})

const showFilter = ref(false);
const listTypesDriverSituations: Ref<Array<TypeDriverSituationDTO>> = ref(
  new Array<TypeDriverSituationDTO>()
);
// representa el indentificador del elemento q se desea eliminar
let idTipoSitDriverSeleccionado = 0;

onMounted(actualizarTypeDriverSituations);

async function actualizarTypeDriverSituations() {
  await getTypeDriverSituations();
}

// Funciones CRUD
async function getTypeDriverSituations() {
  try {
    listTypesDriverSituations.value =
      await typeDriverSistuationService.getTypeDriverSituations();
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }
}

async function postTypeDriverSituations(nombre: string, is_fecha: boolean) {
  try {
    await typeDriverSistuationService.postTypeDriverSituation(nombre, is_fecha);
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
    await actualizarTypeDriverSituations();
    // se cierra el modal
    modalTypeDriverSit.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof BadRequestError)
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
async function deleteTypeDriverSituations() {
  try {
    await typeDriverSistuationService.deleteTypeDriverSituation(idTipoSitDriverSeleccionado);
    // se notifica de la acción
    Notify.create({
      message: 'Se ha elimnado con éxito el Tipo de Situación del Chofer',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se actualiza la información
    await actualizarTypeDriverSituations();
  } catch (error) {
    if (error instanceof BadRequestError)
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

async function updateTypeDriverSituations(id: number, nombre: string) {
  try {
    await typeDriverSistuationService.updateTypeDriverSituation(id, nombre)
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
    await actualizarTypeDriverSituations();
    // se cierra el modal
    modalTypeDriverSit.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof BadRequestError)
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
function activarModalTypeDriverSit(typeDriverSituationDTO?: TypeDriverSituationDTO) {
  // activar el modal
  typeDriverReactivo.value.typeSeleccionado = typeDriverSituationDTO
  modalTypeDriverSit.value?.setShowModal(true);
}



function activarModalConfirmacion(idSitDriver: number) {
  idTipoSitDriverSeleccionado = idSitDriver;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
