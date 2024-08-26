<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex container flex-center">
                <ModalCodigoVerificacion :titulo="`Código de Verificación Requerido`"
                    :parrafo="`Hemos enviado un código de verificación a su dirección de correo electrónico. Por favor, ingrese el
                    código en el campo a continuación para verificar su identidad y proceder con el cambio de su contraseña.`"
                    :informacion="`Si no ha recibido el código, por favor verifique su dirección de correo o intente nuevamente.`"
                    :nombre-boton="'Verificar Código'" @action="verificarCodigoIdentidad" />
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import ModalCodigoVerificacion from 'src/components/Modales/ModalCodigoVerificacion.vue';
import { AuthService } from 'src/logica/auth/AuthService';
import { BadRequestError } from 'src/utils/BadRequestError';

import { useRoute, useRouter } from 'vue-router';

// Se inyecta el servicio de auth service
const authService: AuthService = AuthService.getInstancie()
let idUsuario: number = -1 // representa el id del usuario
// Se obtiene la ruta actual
const route = useRoute()
// Se obtiene el enrrutador
const router = useRouter()
// Se obtienen los parametros de la url
if (typeof route.params.idUsuario === "string")
    idUsuario = parseInt(route.params.idUsuario) // se obtiene el id de la herramienta análisis de criticidad

async function verificarCodigoIdentidad(codigoVerificacion: string) {
    // Lógica para manejar el envío del código de activación
    try {
        await authService.verificarCodigoVerificacion(idUsuario, codigoVerificacion) // si ocurre ninguna badRequest ni error de conexión entonces el código de verificación para el usuario es válido
        // se redirige a la página del cambio de contraseña
        router.push({
            name: "Cambio de Contraseña", params: {
                idUsuario: idUsuario
            }
        })
    } catch (error) {
        if (error instanceof BadRequestError)
            alert(error.message)


        console.log(error)
    }
}
</script>

<style scoped>
.container {
    background-image: url("src/images/fondo-login.jpg");
}
</style>