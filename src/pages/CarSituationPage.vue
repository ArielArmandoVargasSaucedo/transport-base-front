<template>
    <q-page padding>
        <div>
            <q-btn class="button-atras" color="primary" icon="arrow_back" label="Atras" :to="rutaCarPage" />

            <q-card v-if="(carDTO)" class="card-car-inco">
                <q-card-section>
                    <div class="text-h4">Información del Carro</div>
                    <div class="text-subtitle2">Chapa: {{ carDTO.car_number }}</div>
                    <div class="text-subtitle2">Marca: {{ carDTO.car_brand }}</div>
                    <div class="text-subtitle2">Número de Asientos: {{ carDTO.number_of_seats }}</div>
                    <div v-if="(carDTO.currentCarSituation.type_car_situation)" class="text-subtitle2">Situación Actual:
                        {{
                            carDTO.currentCarSituation.type_car_situation.type_cs_name }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="text-h5"> Historial de Situaciones:</div>
                    <CarSituationTable :id-car="idCar" />
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script lang="ts" setup>
import CarSituationTable from 'src/components/CarSituationTable.vue';
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
// se inyecta el servicio de Cars
const carsService: CarsService = CarsService.getInstancie()

//se obtiene la ruta actual
const route = useRoute()

const idCar: number = typeof route.params.idCar === 'string' ? parseInt(route.params.idCar) : -1
const carDTO: Ref<CarDTO | undefined> = ref(undefined)

// Ruta de CarPage
const rutaCarPage = {
    name: "Vehículos"
}

onMounted(getCarroInfo)

async function getCarroInfo() {
    try {
        carDTO.value = await carsService.getCar(idCar)
    } catch (error) {
        alert(error)
    }
}

</script>

<style scoped>
.button-atras {
    margin-top: -28px;
    margin-bottom: 20px;
}
</style>