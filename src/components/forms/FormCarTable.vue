<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <!-- Encabezado del Formulario -->
      <q-card-section class="header bg-primary">
        <div class="header-title text-h5">Formulario Añadir Carro</div>
        <q-btn icon="cancel" @click="setShowForm()" flat />
      </q-card-section>

      <!-- Cuerpo del Formulario -->
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <!-- Campo de Chapa -->
          <q-input filled v-model="datosCar.number" label="Chapa del Carro *" lazy-rules :rules="[
            val =>
              /^[A-Z][0-9]{6}$/.test(val) ||
              'La chapa debe empezar con una letra mayúscula seguida de seis números'
          ]" />
          <!-- Campo de Marca -->
          <q-input filled v-model="datosCar.brand" label="Marca del Carro *" lazy-rules :rules="[
            val =>
              /^[A-Za-z\s]+$/.test(val) ||
              'La marca solo debe contener letras'
          ]" />
          <!-- Campo de Cantidad de Asientos -->
          <q-input filled v-model="datosCar.numOfSeats" type="number" label="Cantidad de Asientos del Carro *"
            lazy-rules :rules="[
              val => val >= 3 || 'La cantidad mínima de asientos es 3'
            ]" />

          <!-- Sección de Situación del Carro -->
          <div class="text-h6 q-mt-md">Situación del Carro</div>
          <q-separator color="primary" inset size="8px" />

          <div class="seccion-car-situation">
            <!-- Fecha de Finalizado -->
            <div>
              <div class="text-h7">Fecha de Finalizado</div>
              <q-date v-model="fecha" mask="YYYY-MM-DD" />
            </div>
            <div class="select-container" >
            <!-- Tipo de Situación -->
            <q-select filled v-model="datosCar.carSituation.typeCarSit" use-input hide-selected fill-input
              input-debounce="0" :options="listTypeCarSituation" label="Tipo de Situación del Carro"
              option-label="type_cs_name">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          </div>
        </q-form>
      </q-card-section>

      <!-- Panel Inferior con Botones -->
      <q-card-section class="panel-inferior">
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat />
        </div>
        <q-btn color="primary" icon="contact_support" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
// Se mantiene el mismo script que en la versión anterior
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarSituationDTO } from 'src/logica/carSituation/CarSituationDTO';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import {
  computed,
  ComputedRef,
  onMounted,
  onUpdated,
  Prop,
  Ref,
  ref,
  watch
} from 'vue';

const typeCarSitService: TypeCarSituationsService =
  TypeCarSituationsService.getInstancie();

interface Props {
  carReactivo: {
    carDTO?: CarDTO;
  };
}

const props: Props = defineProps<Props>();

onUpdated(onReset);

const emit = defineEmits<{
  (e: 'setShowFormCar'): void;
  (
    e: 'postCar',
    car_number: string,
    car_brand: string,
    number_of_seats: number,
    returnDate: Date,
    id_aut_type_cs: number
  ): Promise<void>;
  (
    e: 'updateCar',
    carDTO: CarDTO /* representa la información del carro a modificar */
  ): Promise<void>;
}>();

interface CarSituation {
  returnDate: Date | string;
  typeCarSit: TypeCarSituationDTO | undefined;
}
interface DatosCar {
  number: string;
  brand: string;
  numOfSeats: number;
  carSituation: CarSituation;
}

const datosCar: Ref<DatosCar> = ref<DatosCar>({
  number: '',
  brand: '',
  numOfSeats: 1,
  carSituation: {
    returnDate: new Date(),
    typeCarSit: undefined
  }
});

const fecha: Ref<string> = ref(new Date().toLocaleDateString('en-CA'));

watch(fecha, newFecha => {
  datosCar.value.carSituation.returnDate = new Date(newFecha);
});

const listTypeCarSituation: Ref<Array<TypeCarSituationDTO>> = ref(
  new Array<TypeCarSituationDTO>()
);

onMounted(actualizarListTypeCarSituation);

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

async function onSubmit() {
  if (datosCar.value.carSituation.typeCarSit) {
    if (!props.carReactivo.carDTO) {
      await emit(
        'postCar',
        datosCar.value.number,
        datosCar.value.brand,
        datosCar.value.numOfSeats,
        datosCar.value.carSituation.returnDate as Date,
        datosCar.value.carSituation.typeCarSit.id_aut_type_cs
      );
    } else {
      await emit(
        'updateCar',
        new CarDTO(
          props.carReactivo.carDTO.id_car,
          datosCar.value.number,
          datosCar.value.brand,
          datosCar.value.numOfSeats,
          new CarSituationDTO(
            datosCar.value.carSituation.typeCarSit,
            datosCar.value.carSituation.returnDate as Date
          )
        )
      );
    }
  } else alert('Se debe de seleccionar un tipo de situación');
}

async function onReset() {
  if (!props.carReactivo.carDTO) {
    datosCar.value.number = '';
    datosCar.value.brand = '';
    datosCar.value.numOfSeats = 1;
    fecha.value = new Date().toLocaleDateString('en-CA');
    datosCar.value.carSituation.typeCarSit = undefined;
  } else {
    datosCar.value.number = props.carReactivo.carDTO.car_number;
    datosCar.value.brand = props.carReactivo.carDTO.car_brand;
    datosCar.value.numOfSeats = props.carReactivo.carDTO.number_of_seats;
    fecha.value = props.carReactivo.carDTO.currentCarSituation
      .return_date_cs as unknown as string;
    datosCar.value.carSituation.typeCarSit =
      props.carReactivo.carDTO.currentCarSituation.type_car_situation;
  }
}

function setShowForm() {
  emit('setShowFormCar');
}

defineExpose({ onReset });
</script>

<style scoped>
.card-campo {
  width: 100%;
  margin: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.header-title {
  font-weight: bold;
}

.seccion-car-situation {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (min-width: 768px) {
  .seccion-car-situation {
    flex-direction: row;
  }
}

.select-container {
  width: 100%;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
}
</style>
