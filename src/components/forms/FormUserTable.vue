<template>
  <div class="q-pa-md form-container">
    <q-card class="card-campo">
      <q-card-section class="header-section row justify-between align-center">
        <div class="text-h5">Formulario Añadir Usuario</div>
        <q-btn icon="cancel" flat dense @click="setShowForm()" class="cancel-btn"></q-btn>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input filled v-model="datosUser.user" label="Nombre del Usuario *" lazy-rules :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" />

          <q-input filled v-model="datosUser.password" label="Contraseña *" :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" type="password" />

          <q-input filled v-model="datosUser.dni" label="DNI del Usuario *" :rules="[
            (val) => (val && val.length > 0) || 'Por favor complete este campo',
          ]" />

          <q-select filled v-model="datosUser.role.role_type" use-input hide-selected fill-input input-debounce="0"
            :options="listRole" label="Tipo de Rol del Usuario" option-label="role_type" />

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

const roleService: RoleService = RoleService.getInstancie();

interface Props {
  userReactivo: {
    userDTO?: UserDTO;
  };
}

const props = defineProps<Props>();
onUpdated(onReset);

const emit = defineEmits<{
  (e: 'setShowFormUser'): void;
  (e: 'postUser', user_name: string, dni_user: string, password_user: string, id_aut_role: number): Promise<void>;
  (e: 'updateUser', userDTO: UserDTO): Promise<void>;
}>();

interface Role {
  id_aut_role: number;
  role_type: string;
}

interface DatosUser {
  user: string;
  dni: string;
  password: string;
  role: Role;
  id_driver: number;
}

const datosUser: Ref<DatosUser> = ref<DatosUser>({
  user: '',
  dni: '',
  password: '',
  role: { id_aut_role: 1, role_type: '' },
  id_driver: 1,
});

const listRole: Ref<Array<RoleDTO>> = ref(new Array<RoleDTO>());

onMounted(async () => {
  listRole.value = await roleService.getRole();
});

async function onSubmit() {
  if (datosUser.value.role.role_type) {
    if (!props.userReactivo.userDTO) {
      await emit('postUser', datosUser.value.user, datosUser.value.dni, datosUser.value.password, datosUser.value.role.id_aut_role);
    } else {
      await emit('updateUser', new UserDTO(props.userReactivo.userDTO.id_user, datosUser.value.user, datosUser.value.password, datosUser.value.dni, new RoleDTO(datosUser.value.role.id_aut_role, datosUser.value.role.role_type), datosUser.value.id_driver));
    }
  } else {
    alert('Se debe de seleccionar un tipo de rol');
  }
}

async function onReset() {
  if (!props.userReactivo.userDTO) {
    datosUser.value.user = '';
    datosUser.value.password = '';
    datosUser.value.dni = '';
    datosUser.value.role.id_aut_role = 1;
  } else {
    datosUser.value.user = props.userReactivo.userDTO.user_name;
    datosUser.value.password = props.userReactivo.userDTO.password_user;
    datosUser.value.dni = props.userReactivo.userDTO.dni_user;
    datosUser.value.role.id_aut_role = props.userReactivo.userDTO.role?.id_aut_role ?? 0;
  }
}

function setShowForm() {
  emit('setShowFormUser');
}

defineExpose({ onReset });
</script>

<style scoped>
.form-container {
  max-width: 600px;
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
