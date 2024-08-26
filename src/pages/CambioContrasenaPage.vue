<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex container flex-center">
                <ModalCambioContrasena />
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import ModalCambioContrasena from 'src/components/Modales/ModalCambioContrasena.vue';
</script>

<style scoped>
.container {
    background-image: url("src/images/fondo-login.jpg");
}
</style>