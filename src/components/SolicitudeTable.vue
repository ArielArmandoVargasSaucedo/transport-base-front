<template>
  <div class="q-pa-md">
    <FormSolicitude v-show="showForm" @set-show-form-car="setShowFormSol" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Solicitudes" :rows="listCars"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersSol"
          placeholder="Buscar por X">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersSol"
          placeholder="Buscar por Y" :type="'number'">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersSol"
          placeholder="Buscar por Z">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="setShowFormSol()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense @click=""></q-btn>
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
import FormSolicitude from './forms/FormSolicitude.vue';

// Inyectar el Servicio de los Drivers

const carsService: CarsService = CarsService.getInstancie();

const columns = [
  {
    name: '',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row: CarDTO) => row.car_number,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: '',
    label: 'Tipo de Programación',
    align: 'left',
    field: (row: CarDTO) => row.car_brand,
    sortable: true,
  },
  {
    name: '',
    label: 'Código del Grupo',
    align: 'left',
    field: (row: CarDTO) => row.number_of_seats,
    sortable: true,
  },
  {
    name: '',
    label: 'País de Procendecia',
    align: 'left',
    field: (row: CarDTO) => row.number_of_seats,
    sortable: true,
  },
  {
    name: '',
    label: 'Hora de Comienzo',
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
interface FiltersSol { }

// Se definen las variables reactivas del componente
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());
const showFilter = ref(false);
const filtersSol: Ref<FiltersSol> = ref({});
const showForm = ref(false); // representa si el formulario se muestra o no

onMounted(actualizarSol);

async function actualizarSol() {
  //await getCars();
}

// Funciones CRUD
async function getSol() {
  //try {
  //  listSol.value = await solicitudeService.getSol();
  // } catch (error) {
  // if (error instanceof Error) alert(error.message);
  // }
}

// Eventos
function setShowFormSol() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}
</script>

<style></style>
