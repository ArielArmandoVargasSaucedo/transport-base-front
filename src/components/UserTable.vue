<template>
  <div class="q-pa-md">
    <FormUserTable ref="formUserTable" v-show="showForm" :user-reactivo="userReactivo" @set-show-form-user="setShowFormUser"
    @post-user="postUser" @update-user="updateUser" />
    <q-table :table-header-class="'bg-primary'" :title-class="'text-h4'" title="Usuarios" :rows="listUser"
      :columns="columns" row-key="id">
      <template v-slot:top-right>
        <q-input class="q-mr-md" v-if="showFilter" filled borderless dense debounce="300" v-model="filtersUser.user"
          placeholder="Buscar por Usuario">
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

      <template v-slot:body-cell-Driver="props">
        <q-td :props="props">
          <q-btn v-if="(props.row.driver)" icon="visibility" size="sm" flat dense class="q-ml-sm" @click="navegarTablaDriverSit(props.row.driver)" />
        </q-td>
      </template>


      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense @click="activarFormularioEditar(props.row)" />
          <q-btn icon="delete" size="sm" class="q-ml-sm" flat dense
            @click="activateModalConfirmacion(props.row.id_aut_user)"></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalConfirmacion ref="modalConfirmacion" :text="'Seguro que desea eliminar?'" @action-confirm="deleteUser" />
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
import FormUserTable from './forms/FormUserTable.vue';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { useRouter } from 'vue-router';


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
    name: 'email',
    label: 'Email',
    align: 'left',
    field: (row: UserDTO) => row.email,
    sortable: true,
  },
  {
    name: 'role',
    label: 'Rol del Usuario',
    align: 'left',
    field: (row: UserDTO) => row.role.role_type,
    sortable: true,
  },
  {
    name: 'Driver',
    label: 'Información Chofer',
    align: 'left',
    field: '',
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
  role: undefined
});
const router = useRouter()// se obtiene el enrutador
// Se define un watch para los filtros
watch(filtersUser.value, async (newFilters: FiltersUser) => {
  await getUsers(newFilters.user, newFilters.role);
});

const showForm = ref(false); // representa si el formulario se muestra o no
const formUserTable: Ref<InstanceType<typeof FormUserTable> | null> =
  ref(null);
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);
// se crea una variable para el formulario de car table

onMounted(() => {
  actualizarUsers()
  actualizarRoles()
});

async function actualizarUsers() {
  await getUsers(
    filtersUser.value.user,
    filtersUser.value.role
  );
}

async function actualizarRoles() {
  await getRoles()
}

// Funciones CRUD


async function getUsers(user: string, role: RoleDTO | undefined) {
  try {
    listUser.value = await userService.getUsers(
      user === '' ? undefined : user,
      undefined,
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



//Funcion para insertar un user
async function postUser(
    user_name: string,
    password_user: string,
    email: string,
    id_aut_role: number,
    id_driver?: number,
) {
  try {
    await userService.postUser(user_name,password_user,email,id_aut_role,id_driver);

    // se notifica de la acción
    Notify.create({
      message: 'Usuario insertado con éxito',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se cierra el formulario
    setShowFormUser();

    // se actualiza la información
    await actualizarUsers();
  } catch (error) {
    alert(error);
  }
}

//Funcion para eliminar un user
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
    await actualizarUsers();
  } catch (error) {
    alert(error)
  }
}

// Funcion para editar un user
async function updateUser(user_id:number, user_name:string, password_user:string, email:string) {
  try {
    await userService.updateUser(user_id,user_name,password_user === '' ? undefined : password_user, email)

    // se notifica de la acción
    Notify.create({
      message: 'Se modificó con éxito el usuario',
      type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
      color: 'green', // Cambia el color de la notificación
      position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
      timeout: 3000, // Cambia la duración de la notificación en milisegundos
      icon: 'check_circle', // Añade un icono a la notificación
    });

    // se cierra el formulario
    setShowFormUser();

    // se actualiza la información
    await actualizarUsers();
  } catch (error) {
    alert(error)
  }
}

function navegarTablaDriverSit(driverDTO: DriverDTO) {
  console.log(driverDTO)
  router.push({
    name: 'Situación del Chofer',
    params: {
      idDriver: driverDTO.id,
       rutaAnterior: 'AdminPage'
    },
  });
}

// Eventos
function activarFomularioInsertar() {
  // se deselecciona cualquier carro dto seleccionado
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

function activarFormularioEditar(userSeleccionado: UserDTO) {
  userReactivo.value.userDTO = userSeleccionado
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
