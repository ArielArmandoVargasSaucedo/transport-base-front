<template>
  <div class="q-pa-md">
    <FormCarTable ref="formCarTable" v-show="showForm" :car-reactivo="carReactivo" @set-show-form-car="setShowFormCar"
      @post-car="postCar" @update-car="updateCar" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="$t('carro.carro')" :rows="listCars"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersCars.brand"
          placeholder="$t('carro.buscarMarca')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersCars.numOfSeats" placeholder="$t('carro.buscarAsientos')" :type="'number'">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersCars.number"
          placeholder="$t('carro.buscarChapa')">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarFomularioInsertar()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="visibility" size="sm" flat dense class="q-ml-sm" @click="navegarTablaCarSit(props.row)" />
          <q-btn icon="edit" size="sm" flat dense class="q-ml-sm" @click="activarFormularioEditar(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activateModalConfirmacion(props.row.id_car)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalConfirmacion ref="modalConfirmacion" :text="$t('carro.confirmacionEliminar')" @action-confirm="deleteCar" />
  </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { Ref, onMounted, ref } from 'vue';
import FormCarTable from './forms/FormCarTable.vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import CarSituationTable from './CarSituationTable.vue';
import { useRouter } from 'vue-router';

// Inyectar el Servicio de los Cars

const carsService: CarsService = CarsService.getInstancie();
let id_car_delete = -1;
const router = useRouter() // se obtiene el enrutador

const columns = [
  {
    name: 'number',
    required: true,
    label: "$t('carro.chapa')",
    align: 'left',
    field: (row: CarDTO) => row.car_number,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'brand',
    label: "$t('carro.marca')",
    align: 'left',
    field: (row: CarDTO) => row.car_brand,
    sortable: true,
  },
  {
    name: 'number_of_Seats',
    label: "$t('carro.asientos')",
    align: 'left',
    field: (row: CarDTO) => row.number_of_seats,
    sortable: true,
  },
  {
    name: 'car_situation',
    label: "$t('carro.situacionCarro')",
    align: 'left',
    field: (row: CarDTO) => row.currentCarSituation.type_car_situation?.type_cs_name,
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
interface FiltersCars {
  brand: string;
  number: string;
  numOfSeats: number;
}

// Se definen las variables reactivas del Componente
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());
const carReactivo: Ref<{
  carDTO?: CarDTO
}> = ref({
  carDTO: undefined
})
const showFilter = ref(false);
const filtersCars: Ref<FiltersCars> = ref({
  brand: '',
  number: '',
  numOfSeats: 0,
});

// Se define un watch para los filtros
watch(filtersCars.value, async (newFilters: FiltersCars) => {
  await getCars(newFilters.brand, newFilters.number, newFilters.numOfSeats);
});

const showForm = ref(false); // representa si el formulario se muestra o no
const showTablaCarSit = ref(false) // define si se va a monstrar la tabla de car situations para un carro en específico
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// se crea una variable para el formulario de car table
const formCarTable: Ref<InstanceType<typeof FormCarTable> | null> =
  ref(null);
onMounted(actualizarCars);

async function actualizarCars() {
  await getCars(
    filtersCars.value.brand,
    filtersCars.value.number,
    filtersCars.value.numOfSeats
  );
}

// Funciones CRUD
//Funcion de obtener la lista de Carros
async function getCars(brand: string, number: string, numOfSeats: number) {
  try {
    listCars.value = await carsService.getCars(
      brand === '' ? undefined : brand,
      number === '' ? undefined : number,
      numOfSeats === 0 ? undefined : numOfSeats
    );
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

//Funcion para insertar un carro
async function postCar(
  car_number: string,
  car_brand: string,
  number_of_seats: number,
  returnDate: Date,
  id_aut_type_cs: number
) {
  try {
    await carsService.postCar(
      car_number,
      car_brand,
      number_of_seats,
      id_aut_type_cs,
      returnDate
    );

    // se notifica de la acción
    Notify.create({
      message: 'Carro insertado con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se reinician los campos
    formCarTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }
}

//Funcion para eliminar un carro
async function deleteCar() {
  try {
    await carsService.deleteCar(id_car_delete);
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
    await actualizarCars();
  } catch (error) {
    alert(error)
  }
}

// Funcion para editar un carro
async function updateCar(carDTO: CarDTO /* representa la información del carro a modificar */) {
  try {
    await carsService.updateCar(carDTO)

    // se notifica de la acción
    Notify.create({
      message: 'Se modificó con éxito el carro',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se reinician los campos
    formCarTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)

    console.log(error)
  }
}

// Eventos
function activarFomularioInsertar() {
  // se deselecciona cualquier carro dto seleccionado
  carReactivo.value.carDTO = undefined
  // se muestra el forumulario
  setShowFormCar()
}

function navegarTablaCarSit(carDTOSeleccionado: CarDTO) {
  router.push({
    name: 'Situación del Carro',
    params: {
      idCar: carDTOSeleccionado.id_car,
    },
  });
}


function setShowFormCar() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}


function activarFormularioEditar(carDTOSeleccionado: CarDTO) {
  carReactivo.value.carDTO = carDTOSeleccionado
  // se muestra el forumulario
  showForm.value = false
  showForm.value = true
}

function activateModalConfirmacion(id_car_selected: number) {

  id_car_delete = id_car_selected;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
