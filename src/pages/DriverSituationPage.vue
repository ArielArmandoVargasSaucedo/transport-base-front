<template>
    <q-page padding>
        <div>
            <q-btn class="button-atras" color="primary" icon="arrow_back" label="Atras" :to="rutaDriverPage" />

            <q-card v-if="(driverDTO)" class="card-car-inco">
                <q-card-section>
                    <div class="text-h4">Información del Chofer</div>
                    <div class="text-subtitle2">DNI: {{ driverDTO.dni_driver }}</div>
                    <div class="text-subtitle2">Nombre y Apellidos: {{ driverDTO.driver_name }}</div>
                    <div class="text-subtitle2">Dirección: {{ driverDTO.home_address }}</div>
                    <div class="text-subtitle2">Es Copiloto?: {{ driverDTO.is_copilot }}</div>
                    <div v-if="(driverDTO.currentDriverSituation.type_driver_situation)" class="text-subtitle2">
                        Situación Actual:
                        {{ driverDTO.currentDriverSituation.type_driver_situation.type_ds_name }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="text-h5"> Historial de Situaciones:</div>
                    <DriverSituationTable :id-driver="idDriver" />
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import CarSituationTable from 'src/components/CarSituationTable.vue';
import DriverSituationTable from 'src/components/DriverSituationTable.vue';
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { DriverSituationDTO } from 'src/logica/driverSituation/DriverSituationDTO';
import { BadRequestError } from 'src/utils/BadRequestError';

// se inyecta el servicio de Drivers
const driverService: DriversService = DriversService.getInstancie()



//se obtiene la ruta actual
const route = useRoute()

// se obtienen los parametros de ruta
const idDriver: number = typeof route.params.idDriver === 'string' ? parseInt(route.params.idDriver) : -1
const rutaAnterior: string = typeof route.params.rutaAnterior === 'string' ? route.params.rutaAnterior : ''
const driverDTO: Ref<DriverDTO | undefined> = ref(undefined)


// Ruta de DriverPage
const rutaDriverPage = {
    name: rutaAnterior
}

onMounted(getChoferesInfo)

async function getChoferesInfo() {
    try {
        driverDTO.value = await driverService.getDriver(idDriver)

    } catch (error) {
        if(error instanceof BadRequestError)
        alert(error.message)
    }
}

</script>

<style scoped>
.button-atras {
    margin-top: -28px;
    margin-bottom: 20px;
}
</style>
