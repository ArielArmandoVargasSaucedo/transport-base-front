<template>
    <div class="q-pa-md">
        <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" :title="$t('sitChofer.situacionChofer')"
            :rows="listDriverSituations" :columns="columns" row-key="id">
            <template v-slot:top-right>


                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersDriverSituations.type_driver_situation"
                    :placeholder="$t('sitChofer.tipoSituacion')">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
                <q-btn color="primary" icon-right="archive" :label="$t('exportar.CSV')" no-caps @click="exportTable" />
            </template>
        </q-table>
        <ModalConfirmacion ref="modalConfirmacion" :text="$t('sitChofer.confirmacionEliminar')" @action-confirm="" />
    </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref } from 'vue';
import { exportFile, Notify, useQuasar } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { DriversService } from 'src/logica/drivers/DriversService';
import { DriverSituationDTO } from 'src/logica/driverSituation/DriverSituationDTO';
import { TypeDriverSituationsService } from 'src/logica/typeDriverSituation/TypeDriverSituationsService';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { useI18n } from 'vue-i18n';
import { BadRequestError } from 'src/utils/BadRequestError';


// Inyectar el Servicio de Drivers

const driversService: DriversService = DriversService.getInstancie();

//Se definen las props del componente
interface Props {
    idDriver: number
}

const props: Props = defineProps<Props>()
const { t, locale } = useI18n();

watch(locale /* locale representa el valor de la internacionalización */, () => {

    // se asignan los nuevos valores de la función t
    columns.value = [
        {
            name: 'current_date',
            required: true,
            label: t('sitChofer.fechaActual'),
            align: 'left',
            field: (row: DriverSituationDTO) => row.current_date_ds,
            format: (val: any) => `${val}`,
            sortable: true,
        },
        {
            name: 'return_date',
            label: t('sitChofer.fechaRegreso'),
            align: 'left',
            field: (row: DriverSituationDTO) => row.return_date_ds,
            sortable: true,
        },
        {
            name: 'type_driver_situation',
            label: t('sitChofer.tipoSituacion'),
            align: 'left',
            field: (row: DriverSituationDTO) => row.type_driver_situation?.type_ds_name,
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
        label: t('sitChofer.fechaActual'),
        align: 'left',
        field: (row: DriverSituationDTO) => row.current_date_ds,
        format: (val: any) => `${val}`,
        sortable: true,
    },
    {
        name: 'return_date',
        label: t('sitChofer.fechaRegreso'),
        align: 'left',
        field: (row: DriverSituationDTO) => row.return_date_ds,
        sortable: true,
    },
    {
        name: 'type_driver_situation',
        label: t('sitChofer.tipoSituacion'),
        align: 'left',
        field: (row: DriverSituationDTO) => row.type_driver_situation?.type_ds_name,
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



const typeDriverSitService: TypeDriverSituationsService =
    TypeDriverSituationsService.getInstancie();

//Se define una interfaz para los Filtros
interface FiltersDriverSituations {
    date_ds: Date | undefined;
    type_driver_situation: string
}

// Se definen los emit del componente
const emit = defineEmits<{
    (e: 'setShowDrivSitTable'): void;
}>();

// Se definen las variables reactivas del componente
const listDriverSituations: Ref<Array<DriverSituationDTO>> = ref(new Array<DriverSituationDTO>());
const listTypeDriverSituations: Ref<Array<TypeDriverSituationDTO>> = ref(new Array<TypeDriverSituationDTO>());

const showFilter = ref(false);
const filtersDriverSituations: Ref<FiltersDriverSituations> = ref({
    date_ds: undefined,
    type_driver_situation: "",
});

// Se define un watch para los filtros
watch(filtersDriverSituations.value, async (newFilters: FiltersDriverSituations) => {
    await getDriverSituations(props.idDriver, newFilters.date_ds, newFilters.type_driver_situation);
});



// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
    ref(null);

onMounted(() => {
    actualizarListTypeDriverSituations()
    actualizarDriverSituations()
});

async function actualizarDriverSituations() {
    await getDriverSituations(
        props.idDriver,
        filtersDriverSituations.value.date_ds,
        filtersDriverSituations.value.type_driver_situation,
    );
}

// Funciones CRUD
//Funcion de obtener la lista de Situaciones del Carro
async function getDriverSituations(id_driver: number, date_ds?: Date, type_driver_situation?: string) {
    try {
        listDriverSituations.value = await driversService.getHistorialDriverSituations(id_driver, type_driver_situation)
    } catch (error) {
        if (error instanceof BadRequestError)
            alert(error.message)

        console.log(error)
    }
}

// Funciones

async function actualizarListTypeDriverSituations() {
    await getTypeDriverSituations();
}

async function getTypeDriverSituations() {
    try {
        listTypeDriverSituations.value = await typeDriverSitService.getTypeDriverSituations();
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
        listDriverSituations.value.map(row => columns.value.map(col => wrapCsvValue(
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
