<template>
  <div class="q-pa-md">
    <q-card class="card-campo">
      <q-card-section class="bg-primary text-white row justify-center">
        <div class="col-11 text-h5">Formulario Añadir Usuario</div>
        <div class="col-1 container-icon">
          <q-btn icon="cancel" @click="setShowForm()"></q-btn>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="datosUser.user" label="Nombre del Usuario *" lazy-rules :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="datosUser.password" label="Contraseña *" :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />
          <q-input filled v-model="datosUser.dni" label="DNI del Usuario *" :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor complete este campo',
          ]" />


          <div class="seccion-role">

            <div class="select-container">
              <q-select filled v-model="datosUser.role.role_type" use-input hide-selected fill-input input-debounce="0"
                :options="listRole" label="Tipo de Rol del Usuario" option-label="role_type"
                style="width: 100%; padding-bottom: 32px">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <q-card-section class="panel-inferior">
            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>

          </q-card-section>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { UserDTO } from 'src/logica/user/UserDTO';
import { RoleDTO } from 'src/logica/role/RoleDTO';
import { RoleService } from 'src/logica/role/RoleService';
import { computed, ComputedRef, onMounted, onUpdated, Prop, Ref, ref } from 'vue';
//Se inyecta el servicio de Tipo de Rol para Usuario

const roleService: RoleService =
  RoleService.getInstancie();

// Se define lo q va a recibir el hijo del padre

// Se definen las props del componente
interface Props {
  userReactivo: {
    userDTO?: UserDTO
  }
}

const props: Props = defineProps<Props>()

onUpdated(onReset)

// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'setShowFormUser'): void;
  (
    e: 'postUser',
    user_name: string,
    dni_user: string,
    password_user: string,
    id_aut_role: number
  ): Promise<void>;
  (e: 'updateUser', userDTO: UserDTO /* representa la información del usuario a modificar */): Promise<void>;
}>();

// Se define la interfaz para representar los datos del Campo
interface Role {
  id_aut_role: number;
  role_type: string;
}
interface DatosUser {
  user: string;
  dni: string;
  password: string,
  role: Role;
  id_driver: number
}

// Se definen las variables reactivas del componente
const datosUser: Ref<DatosUser> = ref<DatosUser>({
  user: '',
  dni: '',
  password: '',
  role: {
    id_aut_role: 1,
    role_type: '',
  },
  id_driver: 1,
});



const listRole: Ref<Array<RoleDTO>> = ref(
  new Array<RoleDTO>()
);

// Funciones del ciclo de vida del componente
onMounted(actualizarListRole);

// Funciones

async function actualizarListRole() {
  await getRole();
}

async function getRole() {
  try {
    listRole.value = await roleService.getRole();
  } catch (error) {
    alert(error);
  }
}

async function onSubmit() {
  if (datosUser.value.role.role_type) {
    // si el formulario fue abierto en modo insercción
    if (!props.userReactivo.userDTO) {
      // se llama al metodo de insertar
      await emit(
        'postUser',
        datosUser.value.user,
        datosUser.value.dni,
        datosUser.value.password,
        datosUser.value.role.id_aut_role
      );
    }
    else { // si el formulario fue abierto en modo modificación
      // se llama al método de modificar
      await emit('updateUser', new UserDTO(
        props.userReactivo.userDTO.id_user,
        datosUser.value.user,
        datosUser.value.password,
        datosUser.value.dni,
        new RoleDTO(datosUser.value.role.id_aut_role, datosUser.value.role.role_type),
        datosUser.value.id_driver
      ));
    }


  } else alert('Se debe de seleccionar un tipo de rol');
}

async function onReset() {
  // se reinician los campos del formulario
  // si fue abierto en modo insercción
  if (!props.userReactivo.userDTO) {
    datosUser.value.user = ''
    datosUser.value.password = ''
    datosUser.value.dni = ''
    datosUser.value.role.id_aut_role = 1

  }
  else { // si el formulario fue abierto en modo modificación
    datosUser.value.user = props.userReactivo.userDTO.user_name
    datosUser.value.password = props.userReactivo.userDTO.password_user
    datosUser.value.dni = props.userReactivo.userDTO.dni_user
    datosUser.value.role.id_aut_role = props.userReactivo.userDTO.role?.id_aut_role ?? 0;
  }
}

function setShowForm() {
  emit('setShowFormUser');
}

// se definen las funciones que va a exponer el componente
defineExpose({ onReset })
</script>

<style scoped>
.card-campo {
  width: 100%;
}

.container-icon {
  display: flex;

  justify-content: flex-end;
}

.seccion-role {
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.select-container {
  width: 100%;
}

.panel-inferior {
  display: flex;
  justify-content: space-between;
  /* Distribuye los botones en extremos opuestos */
  padding: 10px;
  /* Espacio interno opcional */
}
</style>
