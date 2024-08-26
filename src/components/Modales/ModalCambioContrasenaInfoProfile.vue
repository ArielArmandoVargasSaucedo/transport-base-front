<template>
    <q-btn label="Cambiar Contraseña" class="text-capitalize" rounded color="primary"
        @click="setShowModal(true)"></q-btn>
    <q-dialog v-model="isDialogOpen">
        <q-card class="password-reset-card" bordered>

            <q-card-section class="header-reset-password bg-primary text-center text-white">
                <div class="text-h6">Cambia tu contraseña</div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="submitPassword">

                    <q-input v-model="currentPassword" type="password" label="Contraseña anterior" clearable
                        :rules="[val => !!val || 'La contraseña anterior es obligatoria']" filled
                        prepend-inner-icon="mdi-lock" class="q-mb-md" />

                    <q-input v-model="newPassword" type="password" label="Nueva contraseña" clearable
                        :rules="[val => !!val || 'La nueva contraseña es obligatoria', val => val.length >= 8 || 'Debe tener al menos 8 caracteres']"
                        filled prepend-inner-icon="mdi-lock" class="q-mb-md" />

                    <q-input v-model="confirmPassword" type="password" label="Confirmar nueva contraseña" clearable
                        :rules="[val => !!val || 'La confirmación es obligatoria', val => val === newPassword || 'Las contraseñas no coinciden']"
                        filled prepend-inner-icon="mdi-lock" class="q-mb-md" />

                    <div class="forgot-password-link text-center q-my-md">
                        <q-btn flat size="sm" label="¿Olvidaste la contraseña?" color="primary"
                            @click="cambiarContrasenaPorOlvido">
                            <q-tooltip>Solicita un cambio de contraseña por olvido</q-tooltip>
                        </q-btn>
                    </div>

                    <q-card-actions class="seccion-botones" align="right">
                        <q-btn flat label="Cancelar" color="primary" @click="setShowModal(false)" />
                        <q-btn label="Cambiar contraseña" color="primary" type="submit" :disable="!isFormValid" />
                    </q-card-actions>

                </q-form>
            </q-card-section>

        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>

import { AuthService } from 'src/logica/auth/AuthService';
import { ref, computed, onUpdated } from 'vue'
import { useRouter } from 'vue-router';

// Servicio de autenticación
const authService: AuthService = AuthService.getInstancie()
const router = useRouter()

const emit = defineEmits<{
    (e: 'changePassword', new_password: string, last_password: string): Promise<void>
}>()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isDialogOpen = ref(false)

const isFormValid = computed(() =>
    !!currentPassword.value &&
    !!newPassword.value &&
    !!confirmPassword.value &&
    newPassword.value.length >= 8 &&
    newPassword.value === confirmPassword.value
)

const submitPassword = async () => {
    if (isFormValid.value) {
        await emit('changePassword', newPassword.value, currentPassword.value)
    }
}

async function cambiarContrasenaPorOlvido() {
    const token = authService.getJwt()
    if (token) {
        await authService.sendEmailVerificacion(token.payload.userId)
        router.push({
            name: "Codigo de Verificacion",
            params: { idUsuario: token.payload.userId }
        })
    }
}

function resetCampos() {
    currentPassword.value = ""
    newPassword.value = ""
    confirmPassword.value = ""
}

function setShowModal(state: boolean) {
    isDialogOpen.value = state
}

onUpdated(resetCampos)

// se define las funciones que va a exponer el componente
defineExpose({ setShowModal })

</script>

<style scoped>
.password-reset-card {
    max-width: 500px;
    margin: auto;
    padding: 0;
    border-radius: 12px;
    background: #ffffff;
    width: 450px;
}

.header-reset-password {
    padding: 16px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.q-card-section {
    padding: 24px;
}

.q-card-actions {
    padding: 16px 24px;
}

.seccion-botones {
    margin-top: 20px;
}

.forgot-password-link {
    margin-top: 10px;
}
</style>