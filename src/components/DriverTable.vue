<template>
  <div class="q-pa-md">
    <FormDriverTable v-show="showForm" @set-show-form-driver="setShowFormDriver" />
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Choferes"
      :rows="listDrivers"
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
          v-model="filtersDrivers.dni"
          placeholder="Buscar por DNI"
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
          v-model="filtersDrivers.name"
          placeholder="Buscar por Nombre"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-if="showFilter"
          filled
          v-model="filtersDrivers.carAsig"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="listCars"
          label="Carro Asignado"
          option-label="car_number"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-if="showFilter"
          filled
          v-model="filtersDrivers.drivSit"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="listTypeDriverSit"
          label="Tipo de Situación del Chofer"
          option-label="type_ds_name"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

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
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { Ref, onMounted, ref } from 'vue';

// Inyectar el Servicio de los Drivers

const driversService: DriversService = DriversService.getInstancie();
const carsService: CarsService = CarsService.getInstancie();
const typeDriverSituation: TypeDriverSituationsService =
  TypeDriverSituationsService.getInstancie();

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
    name: 'categoria',
    label: 'Categoría',
    align: 'left',
    field: (row: DriverDTO) => row.category,
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
    field: (row: DriverDTO) => row.id_car,
    sortable: true,
  },
  {
    name: 'situacChofer',
    label: 'Situación del Chofer',
    align: 'left',
    field: (row: DriverDTO) => row.id_ds,
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
const listDrivers: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());
const showFilter = ref(false);
const filtersDrivers: Ref<FiltersDrivers> = ref({
  dni: '',
  name: '',
  carAsig: undefined,
  drivSit: undefined,
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
  await getDrivers();
}

// Funciones CRUD
async function getDrivers() {
  try {
    listDrivers.value = await driversService.getDrivers();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
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
</script>

<style></style>
