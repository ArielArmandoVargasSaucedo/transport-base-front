<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center container">
                <q-card class="q-pa-lg card-style" bordered flat>
                    <div class="text-center q-mb-md">
                        <q-icon name="badge" size="64px" class="text-primary" />
                        <h2 class="text-h5 q-mt-md">Identifica tu cuenta</h2>
                        <p class="text-subtitle2">¿Cuál es el correo electrónico de tu cuenta?</p>
                    </div>
                    <q-card-section>
                        <q-input v-model="email" filled dense placeholder="correo@ejemplo.com" class="q-mb-md" clearable
                            type="email"
                            :rules="[val => !!val || 'El correo es obligatorio', val => /.+@.+\..+/.test(val) || 'Ingresa un correo válido']" />
                        <q-btn label="Continuar" color="primary" class="full-width q-mb-sm" @click="onSubmit" />
                        <q-btn flat label="Volver" color="primary" class="full-width q-mb-md" @click="onBack" />
                        <q-separator />
                        <q-btn flat label="Obtén ayuda para identificar tu cuenta" color="primary"
                            class="full-width q-mt-md" @click="onHelp" />
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>

import { AuthService } from 'src/logica/auth/AuthService';
import { BadRequestError } from 'src/utils/BadRequestError';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// se inyecta el servicio de auth
const authService: AuthService = AuthService.getInstancie()

// se obtiene el enrrutador
const router = useRouter()

// Se definen las variables reactivas del componente
const email = ref('');

// Maneja el evento de envío del formulario
const onSubmit = async () => {
    if (email.value && /.+@.+\..+/.test(email.value)) {

        try {
            // se obtiene el identificador del usuario de acuerdo a su email
            const idUsuario = await authService.getUserByEmail(email.value)

            // se le envia un correo electronico de verificación al usuario
            await authService.sendEmailVerificacion(idUsuario)
            // se redirige a la ruta para verificar el código
            router.push({
                name: "Codigo de Verificacion",
                params: {
                    idUsuario: idUsuario
                }
            })
        } catch (error) {
            if (error instanceof BadRequestError)
                alert(error.message)

            console.log(error)
        }
    }
    else
        alert("El email debe de tener una sintaxis adecuada")
};

// Maneja la navegación hacia atrás
const onBack = () => {
    // Se regresa al login
    router.push({ name: "Login" })

};

// Maneja la solicitud de ayuda
const onHelp = () => {
    console.log('Ayuda para identificar la cuenta');
};
</script>

<style scoped>
.card-style {
    max-width: 400px;
    width: 100%;
}

.full-width {
    width: 100%;
}

.q-icon.text-primary {
    color: #1D72F3;
}

h2 {
    font-weight: 600;
}

.container {
    background-image: url("src/images/fondo-login.jpg");
}
</style>