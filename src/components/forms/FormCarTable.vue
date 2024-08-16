<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white row justify-center">
        <div class="col-11 text-h5">Formulario Añadir Carro</div>
        <div class="col-1 container-icon">
          <q-btn icon="cancel" @click="setShowForm()"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="datosCar.number" label="Número del Carro *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="datosCar.brand" label="Chapa del Carro *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="datosCar.numOfSeats" :type="'number'" label="Cantidad de Asientos del Carro *" />

          <div class="text-h5">Situación del Carro</div>
          <q-separator color="primary" inset size="16px" />

          <div class="seccion-car-situation">
            <div>
              <div class="text-h7">Fecha de Finalizado</div>
              <q-date v-model="datosCar.carSituation.returnDate" mask="YYYY-MM-DD"  />
            </div>

            <div class="select-container">
              <q-select filled v-model="datosCar.carSituation.typeCarSit" use-input hide-selected fill-input
                input-debounce="0" :options="listTypeCarSituation" label="Tipo de Situación del Carro"
                option-label="type_cs_name" style="width: 100%; padding-bottom: 32px">
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
import { CarSituationDTO } from 'src/logica/carSituation/CarSituationDTO';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { computed, ComputedRef, onMounted, onUpdated, Prop, Ref, ref } from 'vue';
import { format, parse } from 'date-fns';
//Se inyecta el servicio de Tipo de Situaciones para Carro

const typeCarSitService: TypeCarSituationsService =
  TypeCarSituationsService.getInstancie();

// Se define lo q va a recibir el hijo del padre

// Se definen las props del componente
interface Props {
  carReactivo: {
    carDTO?: CarDTO
  }
}

const props: Props = defineProps<Props>()

onUpdated(onReset)

// Se definen los emit del componente
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
  (e: 'updateCar', carDTO: CarDTO /* representa la información del carro a modificar */): Promise<void>;
}>();

// Se define la interfaz para representar los datos del Campo
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

// Se definen las variables reactivas del componente
const datosCar: Ref<DatosCar> = ref<DatosCar>({
  number: '',
  brand: '',
  numOfSeats: 1,
  carSituation: {
    returnDate: new Date(),
    typeCarSit: undefined,
  },
});



const listTypeCarSituation: Ref<Array<TypeCarSituationDTO>> = ref(
  new Array<TypeCarSituationDTO>()
);

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

async function onSubmit() {
  if (datosCar.value.carSituation.typeCarSit) {
    // si el formulario fue abierto en modo insercción
    if (!props.carReactivo.carDTO) {
      // se llama al metodo de insertar
      await emit(
        'postCar',
        datosCar.value.number,
        datosCar.value.brand,
        datosCar.value.numOfSeats,
        datosCar.value.carSituation.returnDate as Date,
        datosCar.value.carSituation.typeCarSit.id_aut_type_cs
      );
    }
    else { // si el formulario fue abierto en modo modificación
      // se llama al método de modificar
      await emit('updateCar', new CarDTO(props.carReactivo.carDTO.id_car, datosCar.value.number, datosCar.value.brand, datosCar.value.numOfSeats,
        new CarSituationDTO(datosCar.value.carSituation.typeCarSit, datosCar.value.carSituation.returnDate as Date)))
    }


  } else alert('Se debe de seleccionar un tipo de situación');
}

async function onReset() {
  // se reinician los campos del formulario
  // si fue abierto en modo insercción
  if (!props.carReactivo.carDTO) {
    datosCar.value.number = ''
    datosCar.value.brand = ''
    datosCar.value.numOfSeats = 1
    datosCar.value.carSituation.returnDate = new Date().toLocaleDateString('en-CA'); // Formato de Canadá
    datosCar.value.carSituation.typeCarSit = undefined
  }
  else { // si el formulario fue abierto en modo modificación
    datosCar.value.number = props.carReactivo.carDTO.car_number
    datosCar.value.brand = props.carReactivo.carDTO.car_brand
    datosCar.value.numOfSeats = props.carReactivo.carDTO.number_of_seats
    datosCar.value.carSituation.returnDate = props.carReactivo.carDTO.car_situation?.return_date_cs as Date
    datosCar.value.carSituation.typeCarSit = props.carReactivo.carDTO.car_situation?.type_car_situation
  }
}

function setShowForm() {
  emit('setShowFormCar');
}

// se definen las funciones que va a exponer el componente
defineExpose({ onReset })
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
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.select-container {
  width: 100%;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  /* Distribuye los botones en extremos opuestos */
  padding: 10px;
  /* Espacio interno opcional */
}
</style>
