<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white row justify-center">
        <div class="col-11 text-h5">Formulario Añadir Chófer</div>
        <div class="col-1 container-icon">
          <q-btn icon="cancel" @click="setShowForm()"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="driverDTO.dni_driver" label="DNI *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="driverDTO.driver_name" label="Nombre y Apellidos *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="driverDTO.home_address" label="Dirección Particular *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-checkbox v-model="driverDTO.is_copilot" label="Es Copiloto?" />

          <div class="text-h5">Situación del Chófer</div>
          <q-separator color="primary" inset size="16px" />

          <div class="seccion-car-situation">
            <div>
              <div class="text-h7">Fecha de Finalizado</div>
              <q-date v-model="driverDTO.driver_situation.return_date_ds" />
            </div>

            <div class="select-container">
              <q-select filled v-model="driverDTO.driver_situation.type_driver_situation" use-input hide-selected
                fill-input input-debounce="0" :options="listTypeDriverSit" label="Tipo de Situación del Chófer"
                option-label="type_ds_name" style="width: 100%; padding-bottom: 32px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select filled v-model="driverDTO.car" use-input hide-selected fill-input input-debounce="0"
                :options="listCars" label="Carro Asignado" option-label="car_number"
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
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriverSituationDTO } from 'src/logica/driverSituation/DriverSituationDTO';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { onMounted, ref, Ref } from 'vue';

// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'setShowFormDriver'): void;
  (e: 'postDriver', driverDTO: DriverDTO): Promise<void>;
}>();

// Se inyecta el Servicio de los tipos de situaciones de drivers para obtener las situaciones
const typeDriverSituation: TypeDriverSituationsService =
  TypeDriverSituationsService.getInstancie();
const carsService: CarsService = CarsService.getInstancie();
// se crea una variable que define los datos a llenar para un driver
const driverDTO: Ref<DriverDTO> = ref(new DriverDTO('', '', '', false,
  new DriverSituationDTO(new TypeDriverSituationDTO(''),
    new Date()), undefined))
// lista de situaciones de los choferes
const listTypeDriverSit: Ref<Array<TypeDriverSituationDTO>> = ref(
  new Array<TypeDriverSituationDTO>()
);

const listCars: Ref<Array<CarDTO>> = ref(new Array<CarDTO>());

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

onMounted(async () => {
  await actualizarListTypeDriverSituation()
  await actualizarListCar()
})

async function onSubmit() {
  await emit('postDriver', driverDTO.value)
}

async function onReset() {

}

function setShowForm() {
  emit('setShowFormDriver');
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
