<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <!-- Encabezado del Formulario -->
      <q-card-section class="header bg-primary">
        <div class="header-title text-h5">Formulario Solicitud</div>
        <q-btn icon="cancel" @click="setShowForm()" flat />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="form-content">
          <div class="form-section">
            <div class="section-header">
              <div class="section-title text-h5">Programación</div>

            </div>

            <div class="form-group">
              <div>
                <div>Fecha de Inicio</div>
                <q-date v-model="fecha_inicio" mask="YYYY-MM-DD" label="Fecha de Inicio" filled />
              </div>

              <q-select filled v-model="datosSolicitud.prog_typeDTO" :options="listPrograms" label="Programación"
                option-label="prog_type_name" use-input hide-selected fill-input input-debounce="0" />
              <q-input filled v-model="datosSolicitud.mileage" type="number" label="Kilometraje *" lazy-rules :rules="[
                (val) => val > 0 || 'El Kilometraje debe ser mayor que 0',
              ]" />
            </div>
          </div>
          <div class="form-section">
            <div class="section-header">
              <div class="section-title text-h5">Grupo Turístico</div>

              <q-checkbox v-show="(!props.solicitudReactiva.solicitudDTO)" v-model="showGrupoTuristico"
                label="Crear uno Nuevo?" />
              <q-separator color="primary" inset size="16px" />
            </div>

            <div class="form-group">
              <div v-if="!showGrupoTuristico">
                <q-select filled v-model="datosSolicitud.groupDTO" :options="listGroups" label="Código del Grupo"
                  option-label="group_code" use-input hide-selected fill-input input-debounce="0" />
              </div>
              <div v-else>
                <q-input filled v-model="datosSolicitud.group.group_code" label="Código del Grupo Nuevo *" lazy-rules
                  :rules="[
                    (val) => /^\d{4}$/.test(val) || 'Debe ser un código de 4 números',
                  ]" />
                <q-input filled v-model="datosSolicitud.group.group_country" label="País de procedencia *" lazy-rules
                  :rules="[
                    (val) => /^[A-Z][a-zA-Z]+$/.test(val) || 'Debe empezar con mayúscula y solo contener letras',
                  ]" />
                <q-input filled v-model="datosSolicitud.group.number_of_tourist" label="Cantidad de Turistas *"
                  type="number" lazy-rules :rules="[
                    (val) => val > 0 || 'Debe ser al menos 1 turista',
                  ]" />
              </div>
              <q-input filled v-model="datosSolicitud.programming_to_be_done" label="Descripción de la Programación *"
                lazy-rules :rules="[
                  (val) => (val && val.length > 0) || 'Por favor complete este campo',
                ]" />
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <div class="section-title text-h5">Carro Asignado</div>
              <q-separator color="primary" inset size="16px" />
            </div>
            <q-select filled v-model="datosSolicitud.carDTO" :options="listCars" label="Número del Carro"
              option-label="car_number" use-input hide-selected fill-input input-debounce="0" />
            <q-select v-if="(datosSolicitud.carDTO)" filled v-model="datosSolicitud.driverDTO" :options="listDrivers"
              label="Chofer" option-label="dni_driver" use-input hide-selected fill-input input-debounce="0" />
          </div>

          <div class="form-section">
            <div class="section-header">
              <div class="section-title text-h5">Ruta</div>
              <q-separator color="primary" inset size="16px" />
            </div>
            <div class="form-group">
              <q-input filled v-model="datosSolicitud.route.km_available_star"
                label="Kilómetros disponibles al comenzar *" type="number" lazy-rules
                :rules="[(val) => val > 0 || 'Debe ser al menos 1']" />
              <q-input filled v-model="datosSolicitud.route.km_available_end"
                label="Kilómetros disponibles al finalizar *" type="number" lazy-rules
                :rules="[(val) => val >= 0 || 'Debe ser un número positivo']" />
              <div>
                <div>Fecha Finalizado</div>
                <q-date v-model="fecha_final" mask="YYYY-MM-DD" label="Fecha de Fin" filled />
              </div>

              <q-input filled v-model="datosSolicitud.route.pick_up_location" label="Lugar de recogida *" lazy-rules
                :rules="[
                  (val) => /^[A-Z][a-zA-Z\s]+$/.test(val) || 'Debe empezar con mayúscula y solo contener letras',
                ]" />
            </div>
          </div>

          <div class="panel-inferior">
            <q-btn label="Enviar" type="submit" color="primary" />
            <q-btn label="Resetear" type="reset" color="primary" flat />
            <q-btn color="primary" icon="help_outline" flat />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { RefSymbol } from '@vue/reactivity';
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { GroupsToursService } from 'src/logica/groupTour/GroupsTourService';
import { GroupTourDTO } from 'src/logica/groupTour/GroupTourDTO';
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';
import { ProgramTypesService } from 'src/logica/programTypes/ProgramTypesService';
import { RouteDTO } from 'src/logica/route/Route.DTO';
import { SolicitudeDTO } from 'src/logica/solicitude/SolicitudeDTO';
import { onUpdated, onMounted, ref, watch, Ref } from 'vue';

const carsService = CarsService.getInstancie();
// Inyectar el Servicio de los Drivers
const driversService: DriversService = DriversService.getInstancie();
const typeProgramsService = ProgramTypesService.getInstancie();
const groupTourService = GroupsToursService.getInstancie();

const emit = defineEmits<{
  (e: 'setShowFormSolicitud'): void;
  (e: 'postSolicitude', programming_to_be_done: string,
    mileage: number,
    id_car: number,
    id_driver: number,
    id_aut_prog_type: number,
    id_group: number | undefined,
    groupDTO: GroupTourDTO | undefined,
    dateD: Date,
    routeDTO: RouteDTO): Promise<void>;
  (e: 'updateSolicitud', id_solicitud: number,
    programming_to_be_done: string,
    mileage: number,
    id_car: number,
    id_aut_prog_type: number,
    dateD: Date,
    id_driver: number,
    routeDTO: RouteDTO): Promise<void>;
}>();

interface DatosSolicitud {
  programming_to_be_done: string;
  mileage: number;
  carDTO: CarDTO | undefined;
  driverDTO: DriverDTO | undefined
  prog_typeDTO: ProgramTypeDTO | undefined;
  groupDTO: GroupTourDTO | undefined;
  group: GroupTour;
  date_inicio: Date;
  route: Route;
}
interface GroupTour {
  group_code: number;
  group_country: string;
  number_of_tourist: number;
}
interface Route {
  km_available_star: number;
  km_available_end: number;
  pick_up_location: string;
  end_time: Date;
}

const datosSolicitud = ref<DatosSolicitud>({
  programming_to_be_done: '',
  mileage: 0,
  carDTO: undefined,
  driverDTO: undefined,
  prog_typeDTO: undefined,
  groupDTO: undefined,
  group: {
    group_code: 0,
    group_country: '',
    number_of_tourist: 0,
  },
  date_inicio: new Date(),
  route: {
    km_available_star: 0,
    km_available_end: 0,
    pick_up_location: '',
    end_time: new Date(),
  },
});

interface Props {
  solicitudReactiva: {
    solicitudDTO?: SolicitudeDTO;
  };
}

const props: Props = defineProps<Props>();

onUpdated(onReset);

const fecha_inicio = ref(new Date().toLocaleDateString('en-CA'));
watch(fecha_inicio, newFecha => {
  datosSolicitud.value.date_inicio = new Date(newFecha);
});

const fecha_final = ref(new Date().toLocaleDateString('en-CA'));
watch(fecha_final, newFecha => {
  datosSolicitud.value.route.end_time = new Date(newFecha);
});

const listPrograms = ref<Array<ProgramTypeDTO>>([]);
const listCars = ref<Array<CarDTO>>([]);
const listDrivers: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());
const listGroups = ref<Array<GroupTourDTO>>([]);
const showGrupoTuristico = ref(false);

onMounted(async () => {
  await actualizarListPrograms();
  await actualizarListCar();
  await actualizarListGroups();

  //se asignan valores por defecto a los select
  datosSolicitud.value.carDTO = listCars.value[0]
  // despues de obtener el primer carro
  // se bucan los drivers que conducen a ese carro
  await getDrivers(listCars.value[0].id_car)
  // se le define un watch para el carDTO

  watch(() => datosSolicitud.value.carDTO, async (newCarDTO) => {
    console.log("Entre al watch")
    if (newCarDTO) {
      await getDrivers(newCarDTO.id_car)
      datosSolicitud.value.driverDTO = listDrivers.value[0]
    }

  })
  datosSolicitud.value.driverDTO = listDrivers.value[0]
  datosSolicitud.value.groupDTO = listGroups.value[0]
  datosSolicitud.value.prog_typeDTO = listPrograms.value[0]

});

async function actualizarListPrograms() {
  await getTypePrograms();
}

async function getTypePrograms() {
  try {
    listPrograms.value = await typeProgramsService.getProgramTypes();
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



async function getDrivers(id_car: number) {
  try {
    listDrivers.value = await driversService.getDrivers(undefined, undefined, undefined, id_car)
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

async function onSubmit() {
  if (datosSolicitud.value.carDTO && datosSolicitud.value.prog_typeDTO && datosSolicitud.value.driverDTO) {
    // si fue abierto en modo insercción
    if (!props.solicitudReactiva.solicitudDTO) {
      if (!showGrupoTuristico.value && datosSolicitud.value.groupDTO) {
        await emit('postSolicitude', datosSolicitud.value.programming_to_be_done,
          datosSolicitud.value.mileage,
          datosSolicitud.value.carDTO.id_car,
          datosSolicitud.value.driverDTO.id as number,
          datosSolicitud.value.prog_typeDTO.id_aut_prog_type,
          datosSolicitud.value.groupDTO.id_group,
          undefined,
          datosSolicitud.value.date_inicio,
          datosSolicitud.value.route);
      } else {
        await emit('postSolicitude', datosSolicitud.value.programming_to_be_done,
          datosSolicitud.value.mileage,
          datosSolicitud.value.carDTO.id_car,
          datosSolicitud.value.driverDTO.id as number,
          datosSolicitud.value.prog_typeDTO.id_aut_prog_type,
          undefined,
          datosSolicitud.value.group,
          datosSolicitud.value.date_inicio,
          datosSolicitud.value.route);
      }
    }
    else { // si fue abierto en modo modificación
      await emit('updateSolicitud', props.solicitudReactiva.solicitudDTO.id_solicitude, datosSolicitud.value.programming_to_be_done,
        datosSolicitud.value.mileage, datosSolicitud.value.carDTO.id_car,
        datosSolicitud.value.prog_typeDTO.id_aut_prog_type,
        datosSolicitud.value.date_inicio, datosSolicitud.value.driverDTO.id as number,
        datosSolicitud.value.route)
    }

  }
}

async function onReset() {
  // si fue abierto en modo insercción
  if (!props.solicitudReactiva.solicitudDTO) {
    datosSolicitud.value.programming_to_be_done = '';
    datosSolicitud.value.mileage = 0;
    datosSolicitud.value.carDTO = listCars.value[0];
    datosSolicitud.value.prog_typeDTO = listPrograms.value[0];
    datosSolicitud.value.groupDTO = listGroups.value[0];
    datosSolicitud.value.group = {
      group_code: 0,
      group_country: '',
      number_of_tourist: 0,
    };
    fecha_inicio.value = new Date().toLocaleDateString('en-CA')

    datosSolicitud.value.route = {
      km_available_star: 0,
      km_available_end: 0,
      pick_up_location: '',
      end_time: new Date(),
    };
    fecha_final.value = new Date().toLocaleDateString('en-CA')
  }
  else { // si fue abierto como modificación
    datosSolicitud.value.programming_to_be_done = props.solicitudReactiva.solicitudDTO.programming_to_be_done;
    datosSolicitud.value.mileage = props.solicitudReactiva.solicitudDTO.mileage;
    datosSolicitud.value.carDTO = props.solicitudReactiva.solicitudDTO.car;
    datosSolicitud.value.prog_typeDTO = props.solicitudReactiva.solicitudDTO.programmingType;
    fecha_inicio.value = props.solicitudReactiva.solicitudDTO.dateD as unknown as string;
    datosSolicitud.value.group = {
      group_code: props.solicitudReactiva.solicitudDTO.groupTour.group_code,
      group_country: props.solicitudReactiva.solicitudDTO.groupTour.group_country,
      number_of_tourist: props.solicitudReactiva.solicitudDTO.groupTour.number_of_tourist,
    };
    datosSolicitud.value.route = {
      km_available_star: props.solicitudReactiva.solicitudDTO.route.km_available_star,
      km_available_end: props.solicitudReactiva.solicitudDTO.route.km_available_end,
      pick_up_location: props.solicitudReactiva.solicitudDTO.route.pick_up_location,
      end_time: new Date(),
    };
    fecha_final.value = props.solicitudReactiva.solicitudDTO.route.end_time as unknown as string
    // se reinicia el checkbox
    showGrupoTuristico.value = true
  }


}

function setShowForm() {
  emit('setShowFormSolicitud');
}

defineExpose({ onReset });
</script>

<style scoped>
.card-campo {

  margin: auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F5F5F5;
}

.header-title {
  font-weight: bold;
  font-size: 1.2em;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-section {
  margin-top: 16px;
}

.section-header {
  display: flex;
  align-items: center;
}



.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.header {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
</style>
