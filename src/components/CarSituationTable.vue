<template>
    <div class="q-pa-md">
        <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Car Situation"
            :rows="listCarSituations" :columns="columns" row-key="id">
            <template v-slot:top-right>


                <q-select filled v-model="filtersCarSituations.type_car_situation" use-input hide-selected fill-input
                    input-debounce="0" :options="listTypeCarSituations" label="Tipo de Situación del Carro"
                    option-label="type_cs_name" style="width: 100%; padding-bottom: 32px">
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                                No results
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
                <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
                <q-btn icon="cancel" @click=""></q-btn>
            </template>
        </q-table>
        <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="" />
    </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { Ref, onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import { CarSituationDTO } from 'src/logica/carSituation/CarSituationDTO';
import { CarSituationsService } from 'src/logica/carSituation/CarSituationsService';
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';


// Inyectar el Servicio de CarSituations

const carSituationsService: CarSituationsService = CarSituationsService.getInstancie();

//Se definen las props del componente
interface Props {
    idCar: number
}

const props: Props = defineProps<Props>()

const columns = [
    {
        name: 'current_date',
        required: true,
        label: 'Fecha Actual',
        align: 'left',
        field: (row: CarSituationDTO) => row.current_date_cs,
        format: (val: any) => `${val}`,
        sortable: true,
    },
    {
        name: 'return_date',
        label: 'Fecha de Regreso',
        align: 'left',
        field: (row: CarSituationDTO) => row.return_date_cs,
        sortable: true,
    },
    {
        name: 'type_car_situation',
        label: 'Tipo de Situación',
        align: 'left',
        field: (row: CarSituationDTO) => row.type_car_situation?.type_cs_name,
        sortable: true,
    },
    {
        name: 'Action',
        label: '',
        align: 'right',
        field: 'Action',
        sortable: true,
    },
];

const typeCarSitService: TypeCarSituationsService =
    TypeCarSituationsService.getInstancie();

//Se define una interfaz para los Filtros
interface FiltersCarSituations {
    date_cs: Date | undefined;
    type_car_situation: TypeCarSituationDTO | undefined;
}

// Se definen los emit del componente
const emit = defineEmits<{
    (e: 'setShowCarSitTable'): void;
}>();

// Se definen las variables reactivas del componente
const listCarSituations: Ref<Array<CarSituationDTO>> = ref(new Array<CarSituationDTO>());
const listTypeCarSituations: Ref<Array<TypeCarSituationDTO>> = ref(new Array<TypeCarSituationDTO>());

const showFilter = ref(false);
const filtersCarSituations: Ref<FiltersCarSituations> = ref({
    date_cs: undefined,
    type_car_situation: undefined,
});

// Se define un watch para los filtros
watch(filtersCarSituations.value, async (newFilters: FiltersCarSituations) => {
    await getCarSituations(newFilters.date_cs, newFilters.type_car_situation);
});

const showForm = ref(false); // representa si el formulario se muestra o no

// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
    ref(null);

onMounted(() => {
    actualizarListTypeCarSituations()
    actualizarCarSituations()
});

async function actualizarCarSituations() {
    await getCarSituations(
        filtersCarSituations.value.date_cs,
        filtersCarSituations.value.type_car_situation,
        props.idCar,
    );
}

// Funciones CRUD
//Funcion de obtener la lista de Situaciones del Carro
async function getCarSituations(date_cs?: Date, type_car_situation?: TypeCarSituationDTO, id_car?: number) {
    try {
        listCarSituations.value = await carSituationsService.getCarSituations(date_cs, type_car_situation ? type_car_situation.id_aut_type_cs : undefined, id_car ? id_car : undefined);
    } catch (error) {
        if (error instanceof Error) alert(error.message);
    }
}



// Funciones

async function actualizarListTypeCarSituations() {
    await getTypeCarSituations();
}

async function getTypeCarSituations() {
    try {
        listTypeCarSituations.value = await typeCarSitService.getTypeCarSituations();
    } catch (error) {
        alert(error);
    }
}



// Eventos

</script>

<style></style>