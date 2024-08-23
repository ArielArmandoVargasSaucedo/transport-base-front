<template>
  <div class="q-pa-md">

    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Cars" :rows="listUser"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersUser.user"
          placeholder="Buscar por Usuario">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersUser.dni"
          placeholder="Buscar por DNI" type="number">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select v-if="showFilter" filled v-model="filtersUser.role" use-input hide-selected fill-input
          input-debounce="0" :options="listRoles" label="Rol asignado" option-label="role_type">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

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
    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="" />
  </div>
</template>

<script lang="ts" setup>

import { UserService } from 'src/logica/user/UserService';
import { Ref, onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';
import { UserDTO } from 'src/logica/user/UserDTO';
import { RoleService } from 'src/logica/role/RoleService';
import { RoleDTO } from 'src/logica/role/RoleDTO';


// Inyectar el Servicio de los users

const userService: UserService = UserService.getInstancie();
const rolesService: RoleService = RoleService.getInstancie();
let id_user_delete = -1;

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
    format: (val: any) => `${val}`,
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
interface FiltersUser {
  user: string;
  dni: string;
  role: RoleDTO | undefined;
}

// Se definen las variables reactivas del componente
const listRoles: Ref<Array<RoleDTO>> = ref(new Array<RoleDTO>());
const listUser: Ref<Array<UserDTO>> = ref(new Array<UserDTO>());
const userReactivo: Ref<{
  userDTO?: UserDTO
}> = ref({
  userDTO: undefined
})
const showFilter = ref(false);
const filtersUser: Ref<FiltersUser> = ref({
  user: '',
  dni: '',
  role: undefined
});

// Se define un watch para los filtros
watch(filtersUser.value, async (newFilters: FiltersUser) => {
  await getUsers(newFilters.user, newFilters.dni, newFilters.role);
});

const showForm = ref(false); // representa si el formulario se muestra o no

// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// se crea una variable para el formulario de car table
//const formUserTable: Ref<InstanceType<typeof FormUserTable> | null> =
// ref(null);
onMounted(() => {
  actualizarUsers()
  actualizarRoles()
});

async function actualizarUsers() {
  await getUsers(
    filtersUser.value.user,
    filtersUser.value.dni,
    filtersUser.value.role
  );
}

async function actualizarRoles() {
  await getRoles()
}

// Funciones CRUD
//Funcion de obtener la lista de Carros

async function getUsers(user: string, dni: string, role: RoleDTO | undefined) {
  try {
    listUser.value = await userService.getUser(
      user === '' ? undefined : user,
      undefined,
      dni === '' ? undefined : dni,
      role ? role.id_aut_role : undefined
    );
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

async function getRoles() {
  try {
    listRoles.value = await rolesService.getRoles()
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}



//Funcion para insertar un carro
/*async function postCar(
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
    formUserTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    await actualizarCars();
  } catch (error) {
    alert(error);
  }
}*/

//Funcion para eliminar un carro
/*async function deleteCar() {
  try {
    await userService.deleteCar(id_user_delete);
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
}*/

// Funcion para editar un carro
async function updateCar(userDTO: UserDTO /* representa la información del carro a modificar */) {
  try {
    //await userService.updateCar(userDTO)

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
    //formUserTable.value?.onReset()
    // se cierra el formulario
    setShowFormCar();

    // se actualiza la información
    // await actualizarCars();
  } catch (error) {
    alert(error)
  }
}

// Eventos
function activarFomularioInsertar() {
  // se deselecciona cualquier carro dto seleccionado
  userReactivo.value.userDTO = undefined
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
  userReactivo.value.userDTO = carDTOSeleccionado
  // se muestra el forumulario
  showForm.value = false
  showForm.value = true
}

function activateModalConfirmacion(id_car_selected: number) {

  id_user_delete = id_car_selected;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
