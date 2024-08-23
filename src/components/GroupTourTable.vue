<template>
    <div class="q-pa-md">
        <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Group Tourist"
            :rows="listGroupsTours" :columns="columns" row-key="id">
            <template v-slot:top-right>
                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersGroups.group_code" placeholder="Código del Grupo" :type="'number'">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersGroups.group_country" placeholder="País de Prcedencia">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
                    v-model="filtersGroups.number_of_tourist" placeholder="Cantidad de turistas" :type="'number'">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

                <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
            </template>

            <template v-slot:body-cell-Action="props">
                <q-td :props="props">
                    <q-btn icon="edit" size="sm" flat dense @click="" />
                </q-td>
            </template>
        </q-table>
        <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="" />
    </div>
</template>

<script lang="ts" setup>

import { Ref, onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { GroupsToursService } from 'src/logica/groupTour/GroupsTourService';
import { watch } from 'vue';
import { GroupTourDTO } from 'src/logica/groupTour/GroupTourDTO';

// Inyectar el Servicio de los Drivers

const groupTourService: GroupsToursService = GroupsToursService.getInstancie();

const columns = [
    {
        name: 'code',
        required: true,
        label: 'Code',
        align: 'left',
        field: (row: GroupTourDTO) => row.group_code,
        format: (val: any) => `${val}`,
        sortable: true,
    },
    {
        name: 'country',
        label: 'Country',
        align: 'left',
        field: (row: GroupTourDTO) => row.group_country,
        sortable: true,
    },
    {
        name: 'number_of_tourist',
        label: 'Number of Tourist',
        align: 'left',
        field: (row: GroupTourDTO) => row.number_of_tourist,
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

//Se define una interfaz para los Filtros
interface FiltersGroups {
    group_code: number;
    group_country: string;
    number_of_tourist: number;
}

// Se definen las variables reactivas del componente
const listGroupsTours: Ref<Array<GroupTourDTO>> = ref(new Array<GroupTourDTO>());

const showFilter = ref(false);
const filtersGroups: Ref<FiltersGroups> = ref({
    group_code: 0,
    group_country: '',
    number_of_tourist: 0,
});

// Se define un watch para los filtros
watch(filtersGroups.value, async (newFilters: FiltersGroups) => {
    await getGroupsTours(newFilters.group_code, newFilters.group_country, newFilters.number_of_tourist);
});

const showForm = ref(false); // representa si el formulario se muestra o no

// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
    ref(null);

onMounted(actualizarGroups);

async function actualizarGroups() {
    await getGroupsTours(
        filtersGroups.value.group_code,
        filtersGroups.value.group_country,
        filtersGroups.value.number_of_tourist
    );
}

// Funciones CRUD
//Funcion de obtener la lista de Grupos Turísticos
async function getGroupsTours(group_code: number,
    group_country: string,
    number_of_tourist: number) {
    try {
        listGroupsTours.value = await groupTourService.getGroupsTours(
            group_code === 0 ? undefined : group_code,
            group_country === '' ? undefined : group_country,
            number_of_tourist === 0 ? undefined : number_of_tourist
        );
    } catch (error) {
        if (error instanceof Error) alert(error.message);
    }
}

//Funcion para insertar un grupo turístico
async function postGroupTour(
    group_code: number,
    group_country: string,
    number_of_tourist: number,
) {
    try {
        await groupTourService.postGroupTour(
            group_code,
            group_country,
            number_of_tourist
        );

        // se notifica de la acción
        Notify.create({
            message: 'Grupo Turísitico insertado con éxito',
            type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
            color: 'green', // Cambia el color de la notificación
            position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
            timeout: 3000, // Cambia la duración de la notificación en milisegundos
            icon: 'check_circle', // Añade un icono a la notificación
        });


        // se actualiza la información
        await actualizarGroups();
    } catch (error) {
        alert(error);
    }
}


// Funcion para editar un Grupo Turísitico
async function updateGroupTour(groupTourDTO: GroupTourDTO /* representa la información del grupo turístico a modificar */) {
    try {
        await groupTourService.updateGrouptour(groupTourDTO)

        // se notifica de la acción
        Notify.create({
            message: 'Se modificó con éxito el grupo turístico',
            type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
            color: 'green', // Cambia el color de la notificación
            position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
            timeout: 3000, // Cambia la duración de la notificación en milisegundos
            icon: 'check_circle', // Añade un icono a la notificación
        });


        // se actualiza la información
        await actualizarGroups();
    } catch (error) {
        alert(error)
    }
}

// Eventos
/*function activarFomularioInsertar() {
    // se deselecciona cualquier carro dto seleccionado
    carReactivo.value.carDTO = undefined
    // se muestra el forumulario
    setShowFormCar()
}
function setShowFormCar() {
    // si esta activado el form
    if (showForm.value) showForm.value = false; // se desactiva
    // esta desactivado
    else showForm.value = true; // se activa
}

function activarFormularioEditar(carDTOSeleccionado: CarDTO) {
    carReactivo.value.carDTO = carDTOSeleccionado
    // se muestra el forumulario
    showForm.value = false
    showForm.value = true
}

function activateModalConfirmacion(id_car_selected: number) {

    id_car_delete = id_car_selected;
    modalConfirmacion.value?.activateModalConfirmacion();
}*/
</script>

<style></style>