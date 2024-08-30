<template>
    <div class="q-pa-md">
        <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" :title="$t('sitCarro.situacionCarro')"
            :rows="listCarSituations" :columns="columns" row-key="id">
            <template v-slot:top-right>


                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersCarSituations.type_car_situation" :placeholder="$t('sitCarro.tipoSituacion')">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
                <q-btn color="primary" icon-right="archive" :label="$t('exportar.CSV')" no-caps @click="exportTable" />
            </template>
        </q-table>
        <ModalConfirmacion ref="modalConfirmacion" :text="$t('exportar.confirmacionEliminar')" @action-confirm="" />
    </div>
</template>

<script lang="ts" setup>
import { CarDTO } from 'src/logica/car/CarDTO';
import { CarsService } from 'src/logica/car/CarsService';
import { Ref, onMounted, ref } from 'vue';
import { exportFile, Notify, useQuasar } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import { CarSituationDTO } from 'src/logica/carSituation/CarSituationDTO';
import { CarSituationsService } from 'src/logica/carSituation/CarSituationsService';
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { TypeCarSituationsService } from 'src/logica/typeCarSituation/TypeCarSituationsService';
import { useI18n } from 'vue-i18n';

// Inyectar el Servicio de Cars

const carsService: CarsService = CarsService.getInstancie();

//Se definen las props del componente
interface Props {
    idCar: number
}

const props: Props = defineProps<Props>()
const { t, locale } = useI18n();

watch(locale /* locale representa el valor de la internacionalización */, () => {
    columns.value = [
        {
            name: 'current_date',
            required: true,
            label: t('sitCarro.fechaActual'),
            align: 'left',
            field: (row: CarSituationDTO) => row.current_date_cs,
            format: (val: any) => `${val}`,
            sortable: true,
        },
        {
            name: 'return_date',
            label: t('sitCarro.fechaRegreso'),
            align: 'left',
            field: (row: CarSituationDTO) => row.return_date_cs,
            sortable: true,
        },
        {
            name: 'type_car_situation',
            label: t('sitCarro.tipoSituacion'),
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
    ]
})
const columns = ref([
    {
        name: 'current_date',
        required: true,
        label: t('sitCarro.fechaActual'),
        align: 'left',
        field: (row: CarSituationDTO) => row.current_date_cs,
        format: (val: any) => `${val}`,
        sortable: true,
    },
    {
        name: 'return_date',
        label: t('sitCarro.fechaRegreso'),
        align: 'left',
        field: (row: CarSituationDTO) => row.return_date_cs,
        sortable: true,
    },
    {
        name: 'type_car_situation',
        label: t('sitCarro.tipoSituacion'),
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
]);

const typeCarSitService: TypeCarSituationsService =
    TypeCarSituationsService.getInstancie();

//Se define una interfaz para los Filtros
interface FiltersCarSituations {
    date_cs: Date | undefined;
    type_car_situation: string
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
    type_car_situation: "",
});

// Se define un watch para los filtros
watch(filtersCarSituations.value, async (newFilters: FiltersCarSituations) => {
    await getCarSituations(props.idCar, newFilters.date_cs, newFilters.type_car_situation);
});



// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
    ref(null);

onMounted(() => {
    actualizarListTypeCarSituations()
    actualizarCarSituations()
});

async function actualizarCarSituations() {
    await getCarSituations(
        props.idCar,
        filtersCarSituations.value.date_cs,
        filtersCarSituations.value.type_car_situation,
    );
}

// Funciones CRUD
//Funcion de obtener la lista de Situaciones del Carro
async function getCarSituations(id_car: number, date_cs?: Date, type_car_situation?: string) {
    try {
        listCarSituations.value = await carsService.getHistorialCarSituations(id_car, type_car_situation)
    } catch (error) {
        if (error instanceof BadRequestError)
            alert(error.message)

        console.log(error)
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
        if (error instanceof BadRequestError)
            alert(error.message)

        console.log(error)
    }
}

// Eventos
function wrapCsvValue(val: any, formatFn?: (val: any, row: any) => string, row?: any): string {
    let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

    formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

    formatted = formatted.split('"').join('""')
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`
}

const $q = useQuasar()

function exportTable() {
    const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
        listCarSituations.value.map(row => columns.value.map(col => wrapCsvValue(
            typeof col.field === 'function'
                ? col.field(row)
                : (row as any)[col.field === void 0 ? col.name : col.field as string],
            col.format,
            row
        )).join(','))
    ).join('\r\n')


    const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
    )

    if (status !== true) {

        $q.notify({
            message: t('exportar.mensaje'),
            color: 'negative',
            icon: 'warning'

        })
    }
}

</script>

<style></style>
