<template>
  <div class="q-pa-md form-container">
    <q-card class="card-campo">
      <q-card-section class="header-section row justify-between align-center">
        <div class="text-h5">Formulario Añadir Usuario</div>
        <q-btn icon="cancel" flat dense @click="setShowForm()" class="cancel-btn"></q-btn>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="datosUser.user_name" label="Nombre del Usuario *" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" />

          <q-input filled v-model="datosUser.password" :label="isOpenToInsertion() ? 'Contraseña *' : 'Contraseña'" :rules="getPasswordRules()" type="password" />

          <q-input filled v-model="datosUser.email" label="Email *" :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" type="email" />

          <q-select filled v-model="datosUser.role" use-input hide-selected fill-input input-debounce="0"
            :options="listRole" label="Tipo de Rol del Usuario" option-label="role_type"
            :disable="!isOpenToInsertion()" />

          <q-select v-if="(datosUser.role && datosUser.role.id_aut_role === RolesEnum.Chofer)" filled
            v-model="datosUser.driver" use-input hide-selected fill-input input-debounce="0" :options="listDriver"
            label="Chofer" option-label="driver_name"  :disable="!isOpenToInsertion()" />

          <q-card-section class="panel-inferior">
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
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
import { onMounted, onUpdated, Ref, ref } from 'vue';
import { DriverDTO } from 'src/logica/drivers/DriverDTO';
import { DriversService } from 'src/logica/drivers/DriversService';
import { RolesEnum } from 'src/utils/RolesEnum';

const roleService: RoleService = RoleService.getInstancie();
const driverService: DriversService = DriversService.getInstancie();
interface Props {
  userReactivo: {
    userDTO?: UserDTO;
  };
}

const props = defineProps<Props>();
onUpdated(onReset);

const emit = defineEmits<{
  (e: 'setShowFormUser'): void;
  (e: 'postUser', user_name: string, password_user: string, email: string, id_aut_role: number, id_driver?: number,): Promise<void>;
  (e: 'updateUser', user_id: number, user_name: string, password_user: string, email: string): Promise<void>;
}>();

interface Role {
  id_aut_role: number;
  role_type: string;
}

interface DatosUser {
  user_name: string;
  password: string;
  email: string
  role: Role | undefined;
  driver: DriverDTO | undefined;
}

const datosUser: Ref<DatosUser> = ref<DatosUser>({
  user_name: '',
  password: '',
  email: '',
  role: undefined,
  driver: undefined,
});

const listRole: Ref<Array<RoleDTO>> = ref(new Array<RoleDTO>());
const listDriver: Ref<Array<DriverDTO>> = ref(new Array<DriverDTO>());

onMounted(async () => {
  await actualizarListRole();
  await actualizarListDrivers();
});

// Funciones
async function actualizarListDrivers() {
  await getDrivers();

}

async function getDrivers() {
  try {
    listDriver.value =
      await driverService.getAllDriversWithOutAccount()
  } catch (error) {
    alert(error);
  }
}


async function actualizarListRole() {
  await getRole();
}

async function getRole() {
  try {
    listRole.value =
      await roleService.getRoles();
  } catch (error) {
    alert(error);
  }
}

async function onSubmit() {
  if (datosUser.value.role) { // si fue seleccionado un rol
    if (!props.userReactivo.userDTO) // si fue abierto como insercción
      await emit('postUser', datosUser.value.user_name, datosUser.value.password, datosUser.value.email, datosUser.value.role.id_aut_role, datosUser.value.driver?.id)
    else // si fue abierto como modificación
      await emit('updateUser', props.userReactivo.userDTO.id_aut_user, datosUser.value.user_name, datosUser.value.password, datosUser.value.email)
  } else {
    alert("No se seleccionó rol")
  }
}

async function onReset() {

  if (!props.userReactivo.userDTO) { // si fue abierto como insercción
    datosUser.value.user_name = '';
    datosUser.value.password = '';
    datosUser.value.email = '';
    datosUser.value.role = undefined
    datosUser.value.driver = undefined
  }
  else {
    datosUser.value.user_name = props.userReactivo.userDTO.user_name;
    datosUser.value.password = '';
    datosUser.value.email = props.userReactivo.userDTO.email;
    datosUser.value.role = props.userReactivo.userDTO.role;
    datosUser.value.driver = props.userReactivo.userDTO.driver;
  }

  // además de ello se actualiza el seleccionador de choferes
  // esto debido a que una insercción o eliminación puede provocar cambios en los choferes disponibles sin cuentas
 await actualizarListDrivers()
}

function isOpenToInsertion() {
  return !props.userReactivo.userDTO
}
function setShowForm() {
  emit('setShowFormUser');
}

function getPasswordRules() {
    if (isOpenToInsertion()) {
      return [
        (val: any) => !!val || 'Por favor complete este campo',
        (val: any) => (val && val.length >= 8) || 'La contraseña debe tener al menos 8 caracteres'
      ];
    } else {
      return [
        (val: any) => !val || val.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
      ];
    }
  }

defineExpose({ onReset });
</script>

<style scoped>
.form-container {

  margin: auto;
}

.card-campo {
  width: 100%;
  padding: 16px;
}

.header-section {
  background-color: var(--q-primary);
  color: white;
  padding: 16px;
  border-radius: 8px 8px 0 0;
}

.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-inferior {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 16px;
}

@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }

  .panel-inferior {
    flex-direction: column;
    align-items: stretch;
  }

  .header-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
