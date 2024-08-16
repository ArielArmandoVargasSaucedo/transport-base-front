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
            <q-input
              filled
              v-model="datosCar.number"
              label="Número del Carro *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />
            <q-input
              filled
              v-model="datosCar.brand"
              label="Chapa del Carro *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />
            <q-input
              filled
              v-model="datosCar.brand"
              label="Chapa del Carro *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />
            <q-input
              filled
              v-model="datosCar.numOfSeats"
              :type="'number'"
              label="Cantidad de Asientos del Carro *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />
  
            <div class="text-h5">Situación del Carro</div>
            <q-separator color="primary" inset size="16px" />
  
            <div class="seccion-car-situation">
              <div>
                <div class="text-h7">Fecha de Finalizado</div>
                <q-date v-model="datosCar.carSituation.returnDate" />
              </div>
  
              <div class="select-container">
                <q-select
                  filled
                  v-model="datosCar.carSituation.typeCarSit"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="listTypeCarSituation"
                  label="Tipo de Situación del Carro"
                  option-label="type_cs_name"
                  style="width: 100%; padding-bottom: 32px"
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
  
            <q-card-section class="panel-inferior">
              <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn
                  label="Reset"
                  type="reset"
                  color="primary"
                  flat
                  class="q-ml-sm"
                />
              </div>
  
              <q-btn color="primary" class="q-ml-sm" icon="contact_support" />
            </q-card-section>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script lang="ts"setup>

  // Se define la interfaz para representar los datos del Campo
interface DriverSituation {
  returnDate: Date;
  typeDriverSit: TypeDriverSituationDTO | undefined;
}
interface DatosDriver {
  dni: string;
  nombreApell: string;
  direcc: number;
  
}

async function onSubmit() {}

async function onReset() {
  datosCar.value.number = '';
}

</script>