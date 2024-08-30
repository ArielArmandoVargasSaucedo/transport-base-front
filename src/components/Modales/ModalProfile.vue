<template>
    <q-btn v-if="user" dense flat color="white" icon="account_circle" :label="user.user_name" target="_blank"
        @click="setShowModal(true)"></q-btn>
    <q-dialog v-if="user" v-model="showModal">
        <q-card class="card-profile-info" bordered>

            <q-card-section class="header-profile-info text-white bg-primary">
                <div class="text-h5">{{ $t('perfil.info') }}</div>
            </q-card-section>

            <q-card-section>
                <q-list>

                    <q-item class="profile-avatar-description">
                        <q-item-section class="container-avatar-profile">
                            <q-avatar size="100px">
                                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                            </q-avatar>
                            <q-btn :label="$t('perfil.foto')" class="text-capitalize" rounded color="primary"
                                style="max-width: 120px"></q-btn>
                        </q-item-section>
                    </q-item>

                    <q-item class="list-campos">
                        <q-item-section class="campo-profile">
                            <div class="campo-label">{{ $t('perfil.nombre') }}</div>
                            <div class="campo-value">
                                {{ user.user_name }}
                                <q-popup-edit v-model="user.user_name" :title="$t('perfil.editarNombre')" auto-save
                                    v-slot="scope" @save="actionPopupMenuNombreUsuario">
                                    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                                </q-popup-edit>
                                <q-icon name="edit" class="campo-edit-icon" />
                            </div>
                        </q-item-section>

                        <q-item-section class="campo-profile">
                            <div class="campo-label">{{ $t('perfil.email') }}</div>
                            <div class="campo-value">{{ user.email }}</div>
                        </q-item-section>

                        <q-item-section class="campo-profile">
                            <div class="campo-label">{{ $t('perfil.rol') }}</div>
                            <div class="campo-value">{{ user.role?.role_type }}</div>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <ModalCambioContrasenaInfoProfile ref="modalCambioContrasenaInfoProfile"
                            @change-password="changePassword" />
                    </q-item>

                </q-list>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="primary" @click="setShowModal(false)" class="text-white">{{ $t('perfil.volver') }}</q-btn>
            </q-card-actions>

        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { AuthService } from 'src/logica/auth/AuthService';
import { UserDTO } from 'src/logica/user/UserDTO';
import { UserService } from 'src/logica/user/UserService';
import { onMounted, ref, Ref } from 'vue';
import ModalCambioContrasenaInfoProfile from './ModalCambioContrasenaInfoProfile.vue';
import { BadRequestError } from 'src/utils/BadRequestError';
import { Notify } from 'quasar';

// Se inyecta el Servicio de Usuarios
const userService: UserService = UserService.getInstancie()
// se inyecta el servicio de Auth
const authService: AuthService = AuthService.getInstancie()
// Se definen las variables reactivas del componente
const user: Ref<UserDTO | undefined> = ref(undefined)
// se crea una variable para el modal
const modalCambioContrasenaInfoProfile: Ref<InstanceType<typeof ModalCambioContrasenaInfoProfile> | null> =
    ref(null);
const showModal = ref(false)
onMounted(getProfileUser)

// Método para obtener los datos del perfil del usuario logeado
async function getProfileUser() {
    try {
        // se obtiene el token
        const token = AuthService.getInstancie().getJwt()
        // si el usuario está logeado
        if (token) {
            // se obtiene la información del usuario logeado
            user.value = await userService.getUser(token.payload.userId)
        }
    } catch (error) {
        alert(error)
    }
}


async function updateUser(user_name: string) {
    try {
        if (user.value) {
            await userService.updateUser(user.value.id_aut_user, user_name)
        }
    } catch (error) {
        if (error instanceof BadRequestError)
            alert(error.message)
    }
}

async function changePassword(new_password: string, last_password: string) {
    try {
        if (user.value) {
            await authService.changePassword(user.value.id_aut_user, new_password, last_password)
            // se notifica de la acción
            Notify.create({
                message: 'Cambio de contraseña fue completado satisfactoriamente',
                type: 'positive', // Cambia el tipo a 'negative', 'warning', 'info', etc.
                color: 'green', // Cambia el color de la notificación
                position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
                timeout: 3000, // Cambia la duración de la notificación en milisegundos
                icon: 'check_circle', // Añade un icono a la notificación
            });
            // se cierra el modal
            modalCambioContrasenaInfoProfile.value?.setShowModal(false)
        }
    } catch (error) {
        if (error instanceof BadRequestError)
            alert(error.message)
    }
}

// Eventos
function setShowModal(estado: boolean) {
    showModal.value = estado
}

async function actionPopupMenuNombreUsuario(new_user_name: string) {
    // se ejecuta el update del usuario
    await updateUser(new_user_name)
}

</script>

<style scoped>
.card-profile-info {
    max-width: 1000px;
    margin: auto;
    background: #ffffff;
    border-radius: 12px;
    width: 600px;
}

.header-profile-info {
    padding: 16px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.profile-avatar-description {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.container-avatar-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.list-campos {
    margin-bottom: 20px;
}

.campo-profile {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
}

.campo-label {
    font-weight: bold;
    color: #555555;
}

.campo-value {
    display: flex;
    align-items: center;
    color: #333333;
}

.campo-edit-icon {
    margin-left: 8px;
    cursor: pointer;
    color: #007bff;
}
</style>