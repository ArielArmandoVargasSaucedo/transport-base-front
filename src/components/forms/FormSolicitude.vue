<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white row justify-center">
        <div class="col-11 text-h5">Formulario Añadir Solicitud</div>
        <div class="col-1 container-icon">
          <q-btn icon="cancel" @click="setShowForm()"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="text-h5">Programación</div>
          <q-separator color="primary" inset size="16px" />

          <div class="container-programacion">
            <div class="programacion-fechas">
              <div class="fecha-finalizado">
                <div class="text-h7">Fecha de Finalizado</div>
                <q-date v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
              </div>
              <div>
                <div class="text-h7">Hora</div>
                <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
              </div>
            </div>

            <div class="select-container-programacion">
              <q-select filled v-model="datosCar.carSituation.typeCarSit" use-input hide-selected fill-input
                input-debounce="0" :options="listTypeCarSituation" label="Programación" option-label="type_cs_name"
                style="width: 100%; padding-bottom: 32px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input filled v-model="datosCar.numOfSeats" :type="'number'" label="Kilometraje *" lazy-rules :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]" />
              <q-input filled v-model="datosCar.numOfSeats" :type="'number'" label="Tiempo de demora *" lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Por favor complete este campo',
                ]" />
            </div>
          </div>

          <div class="text-h5">Grupo Turístico</div>
          <q-checkbox v-model="showGrupoTuristico" label="Crear uno Nuevo?" />
          <q-separator color="primary" inset size="16px" />
          <div class="container-grupo-turistico">
            <div v-show="!showGrupoTuristico" class="container-grupo-turistico-seleccionar">
              <q-select filled v-model="datosCar.carSituation.typeCarSit" use-input hide-selected fill-input
                input-debounce="0" :options="listTypeCarSituation" label="Código del Grupo" option-label="type_cs_name"
                style="width: 100%;">
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
              <q-input filled v-model="datosCar.number" label="Código del Grupo Nuevo *" lazy-rules :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]" />
              <q-input filled v-model="datosCar.number" label="País de procedencia *" lazy-rules :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]" />
              <q-input filled v-model="datosCar.number" label="Cantidad de Turistas *" lazy-rules type="number" />
            </div>

            <q-input filled v-model="datosCar.number" label="Descripción de la Programación *" lazy-rules :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor complete este campo',
            ]" />
          </div>


          <div class="text-h5">Carro Asignado</div>
          <q-separator color="primary" inset size="16px" />


          <div class="carro-asignado-container">
            <q-select filled v-model="datosCar.carSituation.typeCarSit" use-input hide-selected fill-input
              input-debounce="0" :options="listTypeCarSituation" label="Número del Carro" option-label="type_cs_name"
              style="width: 100%; padding-bottom: 32px">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="text-h5">Ruta</div>
          <q-separator color="primary" inset size="16px" />

          <div class="ruta-container">
            <q-input filled v-model="datosCar.number" label="Kilómetros disponibles al comenzar *" lazy-rules type="number" />
            <q-input filled v-model="datosCar.number" label="Kilómetros disponibles al finalizar *" lazy-rules type="number" />
            <q-input filled v-model="datosCar.number" label="Duración *" lazy-rules type="number" />
            <q-input filled v-model="datosCar.number" label="Lugar de recogida *" lazy-rules :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor complete este campo',
            ]" />
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
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { onMounted, Ref, ref } from 'vue';

//Se inyecta el servicio de Tipo de Situaciones para Carro

const typeCarSitService: TypeCarSituationsService =
  TypeCarSituationsService.getInstancie();

// Se define lo q va a recibir el hijo del padre

// Se definen las props del componente

// Se definen las emits del componente
// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'setShowFormCar'): void;
}>();

// Se define la interfaz para representar los datos del Campo
interface CarSituation {
  returnDate: Date;
  typeCarSit: TypeCarSituationDTO | undefined;
}
interface DatosCar {
  number: string;
  brand: string;
  numOfSeats: number;
  carSituation: CarSituation;
}

// Se definen las variables reactivas del componente
const datosCar: Ref<DatosCar> = ref<DatosCar>({
  number: '',
  brand: '',
  numOfSeats: 0,
  carSituation: {
    returnDate: new Date(),
    typeCarSit: undefined,
  },
});

const listTypeCarSituation: Ref<Array<TypeCarSituationDTO>> = ref(
  new Array<TypeCarSituationDTO>()
);
const showGrupoTuristico = ref(false)
// Funciones del ciclo de vida del componente
onMounted(actualizarListTypeCarSituation);

// Funciones

async function actualizarListTypeCarSituation() {
  await getTypeCarSituation();
}

async function getTypeCarSituation() {
  try {
    listTypeCarSituation.value = await typeCarSitService.getTypeCarSituations();
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
  datosCar.value.number = '';
}

function setShowForm() {
  emit('setShowFormCar');
}
</script>

<style scoped>
.card-campo {
  width: 100%;
}

.container-icon {
  display: flex;

  justify-content: flex-end;
}

.seccion-car-situation {
  gap: 15px;
}

.select-container {
  width: 100%;
}

.container-programacion {
  width: 100%;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  /* Distribuye los botones en extremos opuestos */
  padding: 10px;
  /* Espacio interno opcional */
}

.programacion-fechas {
  display: flex;
  gap: 16px;
  /* Distribuye los botones en extremos opuestos */
  padding: 10px;
  /* Espacio interno opcional */
}

.container-programacion {
  display: flex;
  gap: 16px;
  /* Distribuye los botones en extremos opuestos */
  padding: 10px;
  /* Espacio interno opcional */
}

.select-container-programacion {
  padding-top: 30px;
  width: 100%;
}

.container-grupo-turistico {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ruta-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
