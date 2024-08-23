<template>
  <div class="q-pa-md">
    <FormCarTable ref="formCarTable" v-show="showForm" :car-reactivo="carReactivo" @set-show-form-car="setShowFormCar"
      @post-car="postCar" @update-car="updateCar" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Cars" :rows="listUser"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersCars.brand"
          placeholder="Buscar por Chapa">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersCars.numOfSeats" placeholder="Buscar por Número de Asientos" :type="'number'">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersCars.number"
          placeholder="Buscar por Número">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn class="q-ml-sm" icon="filter_list" @click="showFilter = !showFilter" flat />
        <q-btn icon="add_circle" @click="activarFomularioInsertar()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense @click="activarFormularioEditar(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activateModalConfirmacion(props.row.id_car)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="deleteCar" />
  </div>
</template>

<script lang="ts" setup>

import { UserService } from 'src/logica/user/UserService';
import { Ref, onMounted, ref } from 'vue';
import FormCarTable from './forms/FormCarTable.vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { UserDTO } from 'src/logica/user/UserDTO';
import { RoleDTO } from 'src/logica/role/RoleDTO';

// Inyectar el Servicio de los Drivers

const userService: UserService = UserService.getInstancie();
let id_car_delete = -1;

const columns = [
  {
    name: 'usuario',
    required: true,
    label: 'Usuario',
    align: 'left',
    field: (row: UserDTO) => row.user_name,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'dni',
    label: 'DNI',
    align: 'left',
    field: (row: UserDTO) => row.dni_user,
    sortable: true,
  },
  {
    name: 'role',
    label: 'Role del Usuario',
    align: 'left',
    field: (row: UserDTO) => row.role?.role_type,
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
interface FiltersCars {
  brand: string;
  number: string;
  numOfSeats: number;
}

// Se definen las variables reactivas del componente
const listUser: Ref<Array<UserDTO>> = ref(new Array<UserDTO>());
const carReactivo: Ref<{
  carDTO?: UserDTO
}> = ref({
  carDTO: undefined
})
const showFilter = ref(false);
const filtersCars: Ref<FiltersCars> = ref({
  brand: '',
  number: '',
  numOfSeats: 0,
});

// Se define un watch para los filtros
watch(filtersCars.value, async (newFilters: FiltersCars) => {
  await getUser(newFilters.brand, newFilters.number, newFilters.numOfSeats);
});

const showForm = ref(false); // representa si el formulario se muestra o no

// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// se crea una variable para el formulario de car table
const formCarTable: Ref<InstanceType<typeof FormCarTable> | null> =
  ref(null);
onMounted(actualizarCars);

async function actualizarCars() {
  await getUser(
    filtersCars.value.brand,
    filtersCars.value.number,
    filtersCars.value.numOfSeats
  );
}

// Funciones CRUD
//Funcion de obtener la lista de Carros
async function getUser(user: string, dni: string, role: RoleDTO) {
  try {
    listUser.value = await userService.getUser(
      user === '' ? undefined : user,
      dni === '' ? undefined : dni,
      role.role_type === '' ? undefined : role.role_type
    );
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

//Funcion para insertar un carro
async function postCar(
  car_number: string,
  car_brand: string,
  number_of_seats: number,
  returnDate: Date,
  id_aut_type_cs: number
) {
  try {
    await userService.postCar(
      car_number,
      car_brand,
      number_of_seats,
      id_aut_type_cs,
      returnDate
    );

    // se notifica de la acción
    Notify.create({
      message: 'Carro insertado con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se reinician los campos
    formCarTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    alert(error);
  }
}

//Funcion para eliminar un carro
async function deleteCar() {
  try {
    await userService.deleteCar(id_car_delete);
    // se notifica de la acción
    Notify.create({
      message: 'Se eliminó con éxito el carro',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    alert(error)
  }
}

// Funcion para editar un carro
async function updateCar(carDTO: UserDTO /* representa la información del carro a modificar */) {
  try {
    await userService.updateCar(carDTO)

    // se notifica de la acción
    Notify.create({
      message: 'Se modificó con éxito el carro',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se reinician los campos
    formCarTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    alert(error)
  }
}

// Eventos
function activarFomularioInsertar() {
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

function activarFormularioEditar(carDTOSeleccionado: UserDTO) {
  carReactivo.value.carDTO = carDTOSeleccionado
  // se muestra el forumulario
  showForm.value = false
  showForm.value = true
}

function activateModalConfirmacion(id_car_selected: number) {

  id_car_delete = id_car_selected;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
