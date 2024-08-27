<template>
  <div class="q-pa-md">
    <FormDriverTable :driver-reactivo="driverReactivo" v-show="showForm" @set-show-form-driver="setShowFormDriver"
      @post-driver="postDriver" @update-driver="updateDriver" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" :title="$t('chofer.chofer')"
      :rows="listDrivers" :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersDrivers.dni"
          :placeholder="$t('chofer.buscarDNI')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersDrivers.name"
          placeholder="Buscar por Nombre">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select v-if="showFilter" filled v-model="filtersDrivers.carAsig" use-input hide-selected fill-input
          input-debounce="0" :options="listCars" label="Carro Asignado" option-label="car_number">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectCar()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-if="showFilter" filled v-model="filtersDrivers.drivSit" use-input hide-selected fill-input
          input-debounce="0" :options="listTypeDriverSit" label="Tipo de Situación del Chofer"
          option-label="type_ds_name">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectTypeDriverSituation()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarFomularioInsertar()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="visibility" size="sm" flat dense class="q-ml-sm" @click="navegarTablaDriverSit(props.row)" />
          <q-btn icon="edit" size="sm" flat dense class="q-ml-sm" @click="activarFormularioEditar(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activateModalConfirmacion(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="deleteDriver" />
  </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { Ref, onMounted, ref, watch } from 'vue';
import FormDriverTable from './forms/FormDriverTable.vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import { useRouter } from 'vue-router';
// Inyectar el Servicio de los Drivers

const driversService: DriversService = DriversService.getInstancie();
const carsService: CarsService = CarsService.getInstancie();
const typeDriverSituation: TypeDriverSituationsService =
  TypeDriverSituationsService.getInstancie();
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
let id_driver_delete = -1;
const router = useRouter()// se obtiene el enrutador

const columns = [
  {
    name: 'dni',
    required: true,
    label: 'Dni',
    align: 'left',
    field: (row: DriverDTO) => row.dni_driver,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: DriverDTO) => row.driver_name,
    sortable: true,
  },
  {
    name: 'direccion',
    label: 'Dirección Particular',
    align: 'left',
    field: (row: DriverDTO) => row.home_address,
    sortable: true,
  },
  {
    name: 'copiloto',
    label: 'Copiloto',
    align: 'left',
    field: (row: DriverDTO) => row.is_copilot,
    sortable: true,
  },
  {
    name: 'carroAsig',
    label: 'Carro Asignado',
    align: 'left',
    field: (row: DriverDTO) => row.car?.car_number,
    sortable: true,
  },
  {
    name: 'situacChofer',
    label: 'Situación del Chofer',
    align: 'left',
    field: (row: DriverDTO) => row.currentDriverSituation.type_driver_situation?.type_ds_name,
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

//Se define una interfaz para los Filtros
interface FiltersDrivers {
  dni: string;
  name: string;
  carAsig: CarDTO | undefined;
  drivSit: TypeDriverSituationDTO | undefined;
}

// Se definen las variables reactivas del componente
const driverReactivo: Ref<{
  driverDTO?: DriverDTO
}> = ref({
  driverDTO: undefined
})
const listDrivers: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());
const showFilter = ref(false);
const filtersDrivers: Ref<FiltersDrivers> = ref({
  dni: '',
  name: '',
  carAsig: undefined,
  drivSit: undefined,
});

// Se define un watch para los filtros
watch(filtersDrivers.value, async (newFilters: FiltersDrivers) => {
  await getDrivers(newFilters.dni, newFilters.name, newFilters.drivSit, newFilters.carAsig);
});

const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());

const listTypeDriverSit: Ref<Array<TypeDriverSituationDTO>> = ref(
  new Array<TypeDriverSituationDTO>()
);

const showForm = ref(false);
onMounted(async () => {
  await actualizarDrivers();
  await actualizarListCar();
  await actualizarListTypeDriverSituation();
});

async function actualizarDrivers() {
  await getDrivers(
    filtersDrivers.value.dni,
    filtersDrivers.value.name,
    filtersDrivers.value.drivSit,
    filtersDrivers.value.carAsig);
}

// Funciones CRUD
async function getDrivers(dni_driver: string, driver_name: string, drivSit?: TypeDriverSituationDTO, carDTO?: CarDTO) {
  try {
    listDrivers.value = await driversService.getDrivers(
      dni_driver === '' ? undefined : dni_driver,
      driver_name === '' ? undefined : driver_name,
      !drivSit ? undefined : drivSit.id_aut_type_ds,
      !carDTO ? undefined : carDTO.id_car);

  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

// función para insertar un driver
async function postDriver(driverDTO: DriverDTO) {
  try {
    await driversService.postDriver(driverDTO)
    Notify.create({
      message: 'Chófer insertado con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se cierra el formulario
    setShowFormDriver()


    // se actualiza la información
    await actualizarDrivers();
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }
}

//Funcion para eliminar un chofer
async function deleteDriver() {
  try {
    await driversService.deleteDriver(id_driver_delete);
    // se notifica de la acción
    Notify.create({
      message: 'Se eliminó con éxito el carro',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se actualiza la información
    await actualizarDrivers();
  } catch (error) {
    alert(error)
  }
}

async function updateDriver(driverDTO: DriverDTO) {
  try {
    await driversService.updateDriver(driverDTO)

    // se notifica de la acción
    Notify.create({
      message: 'Se modificó con éxito el chofer',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificaciónn
    });

    // se reinician los campos
    FormDriverTable.value?.onReset()
    // se cierra el formulario
    setShowFormDriver();

    // se actualiza la información
    await actualizarDrivers();
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }

}

async function actualizarListCar() {
  await getCars();
}

async function getCars() {
  try {
    listCars.value = await carsService.getCars();
  } catch (error) {
    alert(error);
  }
}

async function actualizarListTypeDriverSituation() {
  await getTypeDriversSituation();
}

async function getTypeDriversSituation() {
  try {
    listTypeDriverSit.value =
      await typeDriverSituation.getTypeDriverSituations();
  } catch (error) {
    alert(error);
  }
}

// Eventos
function setShowFormDriver() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}

function activateModalConfirmacion(id_driver_selected: number) {

  id_driver_delete = id_driver_selected;
  modalConfirmacion.value?.activateModalConfirmacion();
}

function navegarTablaDriverSit(driverDTO: DriverDTO) {
  router.push({
    name: 'Situación del Chofer',
    params: {
      idDriver: driverDTO.id,
    },
  });
}

function actionCancelSelectTypeDriverSituation() {
  filtersDrivers.value.drivSit = undefined // deseleccionar el tipo de situación
}

function actionCancelSelectCar() {
  filtersDrivers.value.carAsig = undefined // deseleccionar el carro asignado
}

function activarFomularioInsertar() {
  // se deselecciona cualquier carro dto seleccionado
  driverReactivo.value.driverDTO = undefined
  // se muestra el forumulario
  setShowFormDriver()
}

function activarFormularioEditar(driverDTO: DriverDTO) {
  driverReactivo.value.driverDTO = driverDTO
  // se muestra el forumulario
  showForm.value = false
  showForm.value = true
}

</script>

<style></style>
