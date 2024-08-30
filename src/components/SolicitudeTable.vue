<template>
  <div class="q-pa-md">
    <FormSolicitude v-show="showForm" @set-show-form-solicitud="setShowFormSolicitud" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Solicitudes" :rows="listSolicitudes"
      :columns="columns" row-key="id">
      <template v-slot:top-right>

        <q-select v-if="showFilter" filled v-model="filtersSolicitudes.car" use-input hide-selected fill-input
          input-debounce="0" :options="listCars" :label="'Carro'" option-label="type_ds_name">
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

// Inyectar el Servicio de los Drivers

//const carsService: CarsService = CarsService.getInstancie();
const solicitudeService: SolicitudeService = SolicitudeService.getInstancie();
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
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>())
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
onMounted(actualizarSolicitudes);

async function actualizarSolicitudes() {
  await getSolicitudes(
    filtersSolicitudes.value.car,
    filtersSolicitudes.value.driver,
    filtersSolicitudes.value.group,
    filtersSolicitudes.value.program_type,
    filtersSolicitudes.value.date,
  );
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
