<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white header-section">
        <div class="header-title">Formulario Añadir Solicitud</div>
        <div class="header-icon">
          <q-btn icon="cancel" @click="setShowForm()" flat dense />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="text-h5 section-title">Programación</div>
          <q-separator color="primary" inset size="16px" />

          <div class="container-programacion">
            <div class="programacion-fechas">
              <div class="fecha-finalizado">
                <div class="text-h7">Fecha de Finalizado</div>
                <q-date v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
              </div>
              <div>
                <div class="text-h7">Hora de Inicio</div>
                <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
              </div>
              <div>
                <div class="text-h7">Hora de Fin</div>
                <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
              </div>
            </div>

            <div class="select-container-programacion">
              <q-select filled v-model="datosSolicitud.prog_typeDTO" use-input hide-selected fill-input
                input-debounce="0" :options="listPrograms" label="Programación" option-label="prog_type_name">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input filled v-model="datosSolicitud.mileage" :type="'number'" label="Kilometraje *" lazy-rules :rules="[
                (val) => val > 0 || 'El Kilometraje debe ser mayor que 0',
              ]" />
            </div>
          </div>

          <div class="text-h5 section-title">Grupo Turístico</div>
          <q-checkbox v-model="showGrupoTuristico" label="Crear uno Nuevo?" />
          <q-separator color="primary" inset size="16px" />

          <div class="container-grupo-turistico">
            <div v-show="!showGrupoTuristico" class="container-grupo-turistico-seleccionar">
              <q-select filled v-model="datosSolicitud.groupDTO" use-input hide-selected fill-input input-debounce="0"
                :options="listGroups" label="Código del Grupo" option-label="group_code">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div v-show="showGrupoTuristico" class="container-grupo-turistico-crear-nuevo">
              <q-input filled v-model="datosSolicitud.group.group_code" label="Código del Grupo Nuevo *" lazy-rules
                :rules="[
                  (val) => /^\d{4}$/.test(val) || 'Debe ser un código de 4 números',
                ]" />
              <q-input filled v-model="datosSolicitud.group.group_country" label="País de procedencia *" lazy-rules
                :rules="[
                  (val) => /^[A-Z][a-zA-Z]+$/.test(val) || 'Debe empezar con mayúscula y solo contener letras',
                ]" />
              <q-input filled v-model="datosSolicitud.group.number_of_tourist" label="Cantidad de Turistas *" lazy-rules
                :rules="[
                  (val) => val > 0 || 'Debe ser al menos 1 turista',
                ]" type="number" />
            </div>

            <q-input filled v-model="datosSolicitud.programming_to_be_done" label="Descripción de la Programación *"
              lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Por favor complete este campo',
              ]" />
          </div>

          <div class="text-h5 section-title">Carro Asignado</div>
          <q-separator color="primary" inset size="16px" />

          <div class="carro-asignado-container">
            <q-select filled v-model="datosSolicitud.carDTO" use-input hide-selected fill-input input-debounce="0"
              :options="listCars" label="Número del Carro" option-label="car_number">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="text-h5 section-title">Ruta</div>
          <q-separator color="primary" inset size="16px" />

          <div class="ruta-container">
            <q-input filled v-model="datosSolicitud.route.km_available_star"
              label="Kilómetros disponibles al comenzar *" lazy-rules
              :rules="[(val) => val > 0 || 'Debe ser al menos 1']" type="number" />
            <q-input filled v-model="datosSolicitud.route.km_available_end"
              label="Kilómetros disponibles al finalizar *" lazy-rules
              :rules="[(val) => val >= 0 || 'Debe ser un número positivo']" type="number" />
            <q-input filled v-model="datosSolicitud.route.end_time" label="Duración *" lazy-rules
              :rules="[(val) => val > 0 || 'La duración debe ser mayor que 0']" type="number" />
            <q-input filled v-model="datosSolicitud.route.pick_up_location" label="Lugar de recogida *" lazy-rules
              :rules="[(val) => /^[A-Z][a-zA-Z\s]+$/.test(val) || 'Debe empezar con mayúscula y solo contener letras']" />
          </div>

          <q-card-section class="panel-inferior">
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>

            <q-btn color="primary" class="q-ml-sm" icon="contact_support" />
          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>


<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { GroupsToursService } from 'src/logica/groupTour/GroupsTourService';
import { GroupTourDTO } from 'src/logica/groupTour/GroupTourDTO';
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';
import { ProgramTypesService } from 'src/logica/programTypes/ProgramTypesService';
import { onMounted, Ref, ref } from 'vue';

//Se inyecta el servicio para Carro y Programación

const carsService: CarsService = CarsService.getInstancie();
const typeProgramsService: ProgramTypesService = ProgramTypesService.getInstancie();
const groupTourService: GroupsToursService = GroupsToursService.getInstancie();
// Se define lo q va a recibir el hijo del padre

// Se definen las props del componente

// Se definen las emits del componente
// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'setShowFormSolicitud'): void;
}>();




// Se define la interfaz para representar los datos del Campo
interface DatosSolicitud {
  programming_start_time: string;
  programming_to_be_done: string;
  duration_time: string;
  mileage: number;
  carDTO: CarDTO | undefined;
  prog_typeDTO: ProgramTypeDTO | undefined;
  groupDTO: GroupTourDTO | undefined; // representa el seleccionado
  group: GroupTour; // representa el q se va a crear
  date: Date;
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
  end_time: string;

}


// Se definen las variables reactivas del componente
const datosSolicitud: Ref<DatosSolicitud> = ref<DatosSolicitud>({
  programming_start_time: '',
  programming_to_be_done: '',
  duration_time: '',
  mileage: 0,
  carDTO: undefined,
  prog_typeDTO: undefined,
  groupDTO: undefined,
  group: {

    group_code: 0,
    group_country: '',
    number_of_tourist: 0,

  },
  date: new Date(),

  route: {

    km_available_star: 0,
    km_available_end: 0,
    pick_up_location: '',
    end_time: '',

  },

});

const listPrograms: Ref<Array<ProgramTypeDTO>> = ref(new Array<ProgramTypeDTO>());
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());
const listGroups: Ref<Array<GroupTourDTO>> = ref(new Array<GroupTourDTO>())

const showGrupoTuristico = ref(false)
// Funciones del ciclo de vida del componente


onMounted(async () => {
  await actualizarListPrograms()
  await actualizarListCar()
  await actualizarListGroups()
})


// Funciones
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




function model() {
  return {
    model: ref('2019-02-22 21:02'),
  };
}

async function onSubmit() { }

async function onReset() {
  //datosSolicitud.value.number = '';
}

function setShowForm() {
  emit('setShowFormSolicitud');
}
</script>

<style scoped>
.card-campo {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.header-section {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 16px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.header-icon {
  display: flex;
  justify-content: flex-end;
}

.container-programacion,
.container-grupo-turistico,
.ruta-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.programacion-fechas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.section-title {
  margin-bottom: 16px;
}

.q-select,
.q-input,
.q-time,
.q-date {
  width: 100%;
}

@media (min-width: 768px) {

  .programacion-fechas,
  .container-programacion,
  .container-grupo-turistico,
  .ruta-container {
    flex-direction: row;
    gap: 32px;
  }

  .q-select,
  .q-input,
  .q-time,
  .q-date {
    width: calc(33.33% - 16px);
  }
}
</style>
