<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white row justify-between items-center">
        <div class="col-11 text-h5">Formulario Añadir Chófer</div>
        <div class="col-1 container-icon">
          <q-btn icon="cancel" @click="setShowForm()" flat />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="driverDTO.dni_driver" label="DNI *" lazy-rules :rules="[
            (val) =>
              (val && val.length === 11 && /^[0-9]+$/.test(val)) || 'El DNI debe tener 11 números',
          ]" />

          <q-input filled v-model="driverDTO.driver_name" label="Nombre y Apellidos *" lazy-rules :rules="[
            (val) => {
              const namePattern = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*$/;
              const words = val.trim().split(/\s+/);
              return (
                val && words.every((word: any) => namePattern.test(word))
              ) || 'Cada nombre y apellido debe empezar con mayúscula y contener solo letras';
            },
          ]" />

          <q-input filled v-model="driverDTO.home_address" label="Dirección Particular *" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" />

          <q-checkbox v-model="driverDTO.is_copilot" label="Es Copiloto?" />

          <div class="text-h5 q-mt-lg">Situación del Chófer</div>
          <q-separator color="primary" inset size="16px" />

          <div class="seccion-car-situation q-gutter-md q-mt-lg q-mb-lg">
            <div>
              <div class="text-h7">Fecha de Finalizado</div>
              <q-date v-model="fecha" mask="YYYY-MM-DD" />
            </div>

            <div class="select-container">
              <q-select filled v-model="driverDTO.currentDriverSituation.type_driver_situation" use-input hide-selected
                fill-input input-debounce="0" :options="listTypeDriverSit" label="Tipo de Situación del Chófer"
                option-label="type_ds_name" class="q-mt-lg" >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select filled v-model="driverDTO.car" use-input hide-selected fill-input input-debounce="0"
                :options="listCars" label="Carro Asignado" option-label="car_number" class="q-mt-lg"
                >
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

          <div class="panel-inferior justify-between q-mt-lg">
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>

            <q-btn color="primary" class="q-ml-sm" icon="contact_support" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriverSituationDTO } from 'src/logica/driverSituation/DriverSituationDTO';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { onMounted, onUpdated, ref, Ref, watch } from 'vue';

interface Props {
  driverReactivo: {
    driverDTO?: DriverDTO;
  };
}
const props: Props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'setShowFormDriver'): void;
  (e: 'postDriver', driverDTO: DriverDTO): Promise<void>;
  (e: 'updateDriver', driverDTO: DriverDTO): Promise<void>;
}>();

const typeDriverSituation: TypeDriverSituationsService = TypeDriverSituationsService.getInstancie();
const carsService: CarsService = CarsService.getInstancie();

const driverDTO: Ref<DriverDTO> = ref(
  new DriverDTO('', '', '', false, new DriverSituationDTO(undefined, new Date()), undefined)
);

const fecha: Ref<string> = ref(new Date().toLocaleDateString('en-CA'));

watch(fecha, (newFecha) => {
  driverDTO.value.currentDriverSituation.return_date_ds = new Date(newFecha);
});

const listTypeDriverSit: Ref<Array<TypeDriverSituationDTO>> = ref(new Array<TypeDriverSituationDTO>());
const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());

async function actualizarListTypeDriverSituation() {
  await getTypeDriversSituation();
}

async function getTypeDriversSituation() {
  try {
    listTypeDriverSit.value = await typeDriverSituation.getTypeDriverSituations();
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

onUpdated(onReset);

onMounted(async () => {
  await actualizarListTypeDriverSituation();
  await actualizarListCar();
});

async function onSubmit() {
  if (!props.driverReactivo.driverDTO) {
    await emit('postDriver', driverDTO.value);
  } else {
    driverDTO.value.id = props.driverReactivo.driverDTO.id;
    await emit('updateDriver', driverDTO.value);
  }
}

async function onReset() {
  if (!props.driverReactivo.driverDTO) {
    driverDTO.value.dni_driver = '';
    driverDTO.value.driver_name = '';
    driverDTO.value.home_address = '';
    driverDTO.value.is_copilot = false;
    driverDTO.value.car = undefined;
    fecha.value = new Date().toLocaleDateString('en-CA');
    driverDTO.value.currentDriverSituation.type_driver_situation = undefined;
  } else {
    driverDTO.value.dni_driver = props.driverReactivo.driverDTO.dni_driver;
    driverDTO.value.driver_name = props.driverReactivo.driverDTO.driver_name;
    driverDTO.value.home_address = props.driverReactivo.driverDTO.home_address;
    driverDTO.value.is_copilot = props.driverReactivo.driverDTO.is_copilot;
    driverDTO.value.car = props.driverReactivo.driverDTO.car;
    fecha.value = props.driverReactivo.driverDTO.currentDriverSituation.return_date_ds as unknown as string;
    driverDTO.value.currentDriverSituation.type_driver_situation =
      props.driverReactivo.driverDTO.currentDriverSituation.type_driver_situation;
  }
}

function setShowForm() {
  emit('setShowFormDriver');
}
</script>

<style scoped>
.card-campo {
  width: 100%;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.container-icon {
  display: flex;
  justify-content: flex-end;
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
}
</style>
