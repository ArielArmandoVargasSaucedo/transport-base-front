<template>
  <div class="q-pa-md">
    <FormUserTable ref="formUserTable" v-show="showForm" :user-reactivo="userReactivo"
      @set-show-form-user="setShowFormUser" @post-user=".postUser" @update-user="updateUser" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="User" :rows="listUser"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersUser.name"
          placeholder="Buscar por Usuario">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersUser.dni"
          placeholder="Buscar por DNI">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300"
          v-model="filtersUser.id_aut_role" placeholder="Buscar por Role">
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
    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="deleteUser" />
  </div>
</template>

<script lang="ts" setup>
import { UserDTO } from 'src/logica/user/UserDTO';
import { UserService } from 'src/logica/user/UserService';
import { Ref, onMounted, ref } from 'vue';
import FormUserTable from './forms/FormUserTable.vue';
import { Notify } from 'quasar';
import ModalConfirmacion from './Modales/ModalConfirmacion.vue';
import { watch } from 'vue';

// Inyectar el Servicio de los Drivers

const userService: UserService = UserService.getInstancie();
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
    sortable: true,
  },
  {
    name: 'id_aut_role',
    label: 'Role',
    align: 'left',
    field: (row: UserDTO) => row.id_aut_role.role_type,
    sortable: true,
  },
  {
    name: 'id_driver',
    label: 'Numero de Driver',
    align: 'left',
    field: (row: UserDTO) => row.id_driver,
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
  name: string;
  dni: string;
  id_aut_role: number;
}

// Se definen las variables reactivas del componente
const listUser: Ref<Array<UserDTO>> = ref(new Array<UserDTO>());
const userReactivo: Ref<{
  userDTO?: UserDTO
}> = ref({
  userDTO: undefined
})
const showFilter = ref(false);
const filtersUser: Ref<FiltersUser> = ref({
  name: '',
  dni: '',
  id_aut_role: 0,
});

// Se define un watch para los filtros
watch(filtersUser.value, async (newFilters: FiltersUser) => {
  await getUser(newFilters.name, newFilters.dni, newFilters.id_aut_role);
});

const showForm = ref(false); // representa si el formulario se muestra o no

// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// se crea una variable para el formulario de user table
const formUserTable: Ref<InstanceType<typeof FormUserTable> | null> =
  ref(null);
onMounted(actualizarUser);

async function actualizarUser() {
  await getUser(
    filtersUser.value.name,
    filtersUser.value.dni,
    filtersUser.value.id_aut_role
  );
}

// Funciones CRUD
//Funcion de obtener la lista de usuarios
async function getUser(name: string, dni: string, id_aut_role: number) {
  try {
    listUser.value = await userService.getUser(
      name === '' ? undefined : name,
      dni === '' ? undefined : dni,
      id_aut_role === 0 ? undefined : id_aut_role
    );
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

//Funcion para insertar un usuario
async function postUser(
  user_name: string,
  password_user: string,
  dni_user: string,
  id_aut_role: number,
  id_driver: number,
) {
  try {
    await userService.postUser(
      user_name,
      password_user,
      dni_user,
      id_aut_role,
      id_driver
    );

    // se notifica de la acción
    Notify.create({
      message: 'usuario insertado con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });
    // se reinician los campos
    formUserTable.value?.onReset()
    // se cierra el formulario
    setShowFormUser();

    // se actualiza la información
    await actualizarUser();
  } catch (error) {
    alert(error);
  }
}

//Funcion para eliminar un usuario
async function deleteUser() {
  try {
    await userService.deleteUser(id_user_delete);
    // se notifica de la acción
    Notify.create({
      message: 'Se eliminó con éxito el usuario',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se actualiza la información
    await actualizarUser();
  } catch (error) {
    alert(error)
  }
}

// Funcion para editar un usuario
async function updateUser(userDTO: UserDTO /* representa la información del usuario a modificar */) {
  try {
    await userService.updateUser(userDTO)

    // se notifica de la acción
    Notify.create({
      message: 'Se modificó con éxito el usuario',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se reinician los campos
    formUserTable.value?.onReset()
    // se cierra el formulario
    setShowFormUser();

    // se actualiza la información
    await actualizarUser();
  } catch (error) {
    alert(error)
  }
}

// Eventos
function activarFomularioInsertar() {
  // se deselecciona cualquier usuario dto seleccionado
  userReactivo.value.userDTO = undefined
  // se muestra el forumulario
  setShowFormUser()
}
function setShowFormUser() {
  // si esta activado el form
  if (showForm.value) showForm.value = false; // se desactiva
  // esta desactivado
  else showForm.value = true; // se activa
}

function activarFormularioEditar(userDTOSeleccionado: UserDTO) {
  userReactivo.value.userDTO = userDTOSeleccionado
  // se muestra el forumulario
  showForm.value = false
  showForm.value = true
}

function activateModalConfirmacion(id_user_selected: number) {

  id_user_delete = id_user_selected;
  modalConfirmacion.value?.activateModalConfirmacion();
}
</script>

<style></style>
