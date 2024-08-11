<template>
  <div class="q-pa-md">
    <q-table
      :table-header-class="'bg-primary'"
      :title-class="'text-h4'"
      title="Usuarios"
      :rows="Users"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top-right>
        <q-input
          class="q-mr-md"
          v-if="showFilter"
          filled
          borderless
          dense
          debounce="300"
          v-model="filtersTypeCarSit.nombre"
          placeholder="Buscar por Usuario"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          class="q-ml-sm"
          icon="filter_list"
          @click="showFilter = !showFilter"
          flat
        />
        <q-btn icon="add_circle" @click="activarModalUsers()"></q-btn>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn icon="edit" size="sm" flat dense />
          <q-btn
            icon="delete"
            size="sm"
            class="q-ml-sm"
            flat
            dense
            @click="deleteUser(props.row.id_user)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
    <ModalUsers ref="modalUsers" @post-user-data="postDataUsers" />
  </div>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref } from 'vue';
import ModalUsers from './Modales/ModalUsers.vue';
import { UserService } from 'src/logica/user/UserService';
import { UserDTO } from 'src/logica/user/UserDTO';

// Inyectar el Servicio de los Type Car Situations

const userService: UserService = UserService.getInstancie();

const columns = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: UserDTO) => row.user_name,
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

interface FiltersTypeCarSit {
  nombre: string;
}

// se crea una variable para el modal
const modalUsers: Ref<InstanceType<typeof ModalUsers> | null> = ref(null);
// Se definen las variables reactivas del componente
const filtersTypeCarSit: Ref<FiltersTypeCarSit> = ref({
  nombre: '',
});

const showFilter = ref(false);
const Users: Ref<Array<UserDTO>> = ref(new Array<UserDTO>());

onMounted(actualizarDataUser);

async function actualizarDataUser() {
  await getUsers();
}

// Funciones CRUD
async function getUsers() {
  try {
    Users.value.UserService.getUsers();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

async function postDataUsers(nombre: string) {
  try {
    await userService.postDataUsers(nombre);
    // se actualiza la información
    await actualizarDataUser();
    // se cierra el modal
    modalUsers.value?.setShowModal(false);
  } catch (error) {
    // se van a mostar los errores al usuario
    if (error instanceof Error) alert(error.message);
  }
}
async function deleteUser(id: number) {
  try {
    await userService.deleteUser(id);
    // se actualiza la información
    await actualizarDataUser();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
  }
}

// eventos del componente
function activarModalUsers() {
  // activar el modal
  modalUsers.value?.setShowModal(true);
}
</script>

<style></style>
