<template>
  <div class="q-pa-md">
    <FormCarTable v-show="showForm" @set-show-form-car="setShowFormCar" />
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Cars"
      :rows="listCars"
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
          v-model="filtersCars.brand"
          placeholder="Buscar por Chapa"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input
          class="q-mr-md"
          v-if="showFilter"
          filled
          borderless
          dense
          debounce="300"
          v-model="filtersCars.numOfSeats"
          placeholder="Buscar por Número de Asientos"
          :type="'number'"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input
          class="q-mr-md"
          v-if="showFilter"
          filled
          borderless
          dense
          debounce="300"
          v-model="filtersCars.number"
          placeholder="Buscar por Número"
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
        <q-btn icon="add_circle" @click="setShowFormCar()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn
            icon="delete"
            size="sm"
            class="q-ml-sm"
            flat
            dense
            @click=""
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { Ref, onMounted, ref } from 'vue';
import FormCarTable from './forms/FormCarTable.vue';

// Inyectar el Servicio de los Drivers

const carsService: CarsService = CarsService.getInstancie();

const columns = [
  {
    name: 'number',
    required: true,
    label: 'Number',
    align: 'left',
    field: (row: CarDTO) => row.car_number,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'brand',
    label: 'Brand',
    align: 'left',
    field: (row: CarDTO) => row.car_brand,
    sortable: true,
  },
  {
    name: 'number_of_Seats',
    label: 'Seats',
    align: 'left',
    field: (row: CarDTO) => row.number_of_seats,
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

// Se definen las variables reactivas del componente
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());
const showFilter = ref(false);
const filtersCars: Ref<FiltersCars> = ref({
  brand: '',
  number: '',
  numOfSeats: 0,
});
const showForm = ref(false); // representa si el formulario se muestra o no

onMounted(actualizarCars);

async function actualizarCars() {
  await getCars();
}

// Funciones CRUD
async function getCars() {
  try {
    listCars.value = await carsService.getCars();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

// Eventos
function setShowFormCar() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}
</script>

<style></style>
