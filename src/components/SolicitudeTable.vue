<template>
  <div class="q-pa-md">
    <FormSolicitude v-show="showForm" @set-show-form-solicitud="setShowFormSolicitud" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Solicitudes" :rows="listSolicitudes"
      :columns="columns" row-key="id">
      <template v-slot:top-right>

        <q-select v-if="showFilter" filled v-model="filtersSolicitudes.car" use-input hide-selected fill-input
          input-debounce="0" :options="listCars" :label="'Carro'" option-label="car_number">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectCar()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('texto.noResultado') }}</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-if="showFilter" filled v-model="filtersSolicitudes.driver" use-input hide-selected fill-input
          input-debounce="0" :options="listDrivers" :label="'Choferes'" option-label="dni_driver">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectCar()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('texto.noResultado') }}</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-if="showFilter" filled v-model="filtersSolicitudes.group" use-input hide-selected fill-input
          input-debounce="0" :options="listGroups" :label="'Grupo'" option-label="group_code">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectCar()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('texto.noResultado') }}</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select v-if="showFilter" filled v-model="filtersSolicitudes.program_type" use-input hide-selected fill-input
          input-debounce="0" :options="listPrograms" :label="'Programación'" option-label="prog_type_name">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="cancel" @click="actionCancelSelectCar()" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('texto.noResultado') }}</q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="setShowFormSolicitud()"></q-btn>
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
import { Ref, onMounted, ref, watch } from 'vue';
import FormCarTable from './forms/FormCarTable.vue';
import FormSolicitude from './forms/FormSolicitude.vue';
import { SolicitudeService } from 'src/logica/solicitude/SolicitudesService';
import { SolicitudeDTO } from 'src/logica/solicitude/SolicitudeDTO';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';
import { GroupTourDTO } from 'src/logica/groupTour/GroupTourDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { GroupsToursService } from 'src/logica/groupTour/GroupsTourService';
import { ProgramTypesService } from 'src/logica/programTypes/ProgramTypesService';

// Inyectar el Servicio de solicitudes
const solicitudeService: SolicitudeService = SolicitudeService.getInstancie();
// Inyectar el Servicio de los Cars
const carsService: CarsService = CarsService.getInstancie();
// Inyectar el Servicio de los Drivers
const driversService: DriversService = DriversService.getInstancie();
// Inyectar el Servicio de los Drivers
const groupTourService: GroupsToursService = GroupsToursService.getInstancie();
// Inyectar el Servicio de los Drivers
const typeProgramsService: ProgramTypesService = ProgramTypesService.getInstancie();

const columns = [
  {
    name: '',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row: SolicitudeDTO) => row.dateDTO,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: '',
    label: 'Tipo de Programación',
    align: 'left',
    field: (row: SolicitudeDTO) => row.prog_typeDTO.prog_type_name,
    sortable: true,
  },
  {
    name: '',
    label: 'Código del Grupo',
    align: 'left',
    field: (row: SolicitudeDTO) => row.groupDTO.id_group,// VEEEEEEEEEEEEERRRRRRRRRRRR
    sortable: true,
  },
  {
    name: '',
    label: 'País de Procendecia',
    align: 'left',
    field: (row: SolicitudeDTO) => row.groupDTO.group_country,
    sortable: true,
  },
  {
    name: '',
    label: 'Hora de Comienzo',
    align: 'left',
    field: (row: SolicitudeDTO) => row.programming_start_time,
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
interface FiltersSolicitudes {
  car: CarDTO | undefined;
  driver: DriverDTO | undefined;
  program_type: ProgramTypeDTO | undefined;
  group: GroupTourDTO | undefined;
  date: Date | undefined;

}

// Se definen las variables reactivas del componente
const listSolicitudes: Ref<Array<SolicitudeDTO>> = ref(new Array<SolicitudeDTO>());
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());
const listDrivers: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());
const listGroups: Ref<Array<GroupTourDTO>> = ref(new Array<GroupTourDTO>());
const listPrograms: Ref<Array<ProgramTypeDTO>> = ref(new Array<ProgramTypeDTO>());

const solicitudeReactivo: Ref<{
  solicitudeDTO?: SolicitudeDTO
}> = ref({
  solicitudeDTO: undefined
})

const showFilter = ref(false);
const filtersSolicitudes: Ref<FiltersSolicitudes> = ref({
  car: undefined,
  driver: undefined,
  program_type: undefined,
  group: undefined,
  date: undefined,
});

// Se define un watch para los filtros
watch(filtersSolicitudes.value, async (newFilters: FiltersSolicitudes) => {
  await getSolicitudes(newFilters.car,
    newFilters.driver,
    newFilters.group,
    newFilters.program_type,
    newFilters.date,)
})

const showForm = ref(false); // representa si el formulario se muestra o no
const formSolicitudeTable: Ref<InstanceType<typeof FormSolicitude> | null> =
  ref(null);

  onMounted( async () => {
    await actualizarSolicitudes()
    await actualizarListCar()
    await actualizarListPrograms()
    await actualizarListGroups()
    await actualizarListDrivers()
  });

async function actualizarSolicitudes() {
  await getSolicitudes(
    filtersSolicitudes.value.car,
    filtersSolicitudes.value.driver,
    filtersSolicitudes.value.group,
    filtersSolicitudes.value.program_type,
    filtersSolicitudes.value.date,
  );
}

// Funciones de obtención de los filtros
//Funcion de obtener la lista de Carros
async function actualizarListPrograms() {
  await getTypePrograms();
}

async function getTypePrograms() {
  try {
    listPrograms.value =
      await typeProgramsService.getProgramTypes();
  } catch (error) {
    alert(error);
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


async function actualizarListGroups() {
  await getGroups();
}

async function getGroups() {
  try {
    listGroups.value = await groupTourService.getGroupsTours();
  } catch (error) {
    alert(error);
  }
}

async function actualizarListDrivers() {
  await getDrivers();
}

async function getDrivers() {
  try {
    listDrivers.value = await driversService.getDrivers()
  } catch (error) {
    alert(error);
  }
}

// Funciones CRUD
async function getSolicitudes(carDTO?: CarDTO, driverDTO?: DriverDTO, groupDTO?: GroupTourDTO,
  prog_typeDTO?: ProgramTypeDTO, date?: Date) {
  try {
    listSolicitudes.value = await solicitudeService.getSolicitudes(
      carDTO ? carDTO.id_car : undefined,
      driverDTO ? driverDTO.id : undefined,
      prog_typeDTO ? prog_typeDTO.id_aut_prog_type : undefined,
      groupDTO ? groupDTO.id_group : undefined,
      date ? date : undefined
    )
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

// Eventos
function setShowFormSolicitud() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}

function actionCancelSelectCar() {
  filtersSolicitudes.value.car = undefined // se deselecciona el filtro
}
</script>

<style></style>
