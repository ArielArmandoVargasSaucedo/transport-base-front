<template>
  <q-layout view="hHh LpR lFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="changeDragger()" />

        <q-toolbar-title>
          TransportBase
        </q-toolbar-title>
        <div class="div-lateral">
          <ModalProfile />
          <q-btn flat label="Cerrar Sesion" @click="activarModalConfirmacion()" />
        </div>
      </q-toolbar>
    </q-header>

    <DraggerPrincipal ref="draggerPrincipal" :rutas="rutasList" />
    <q-page-container>
      <router-view />
    </q-page-container>
    <ModalConfirmacion ref="modalConfirmacion" :text="'¿Seguro que desea cerrar la sesión?'" @action-confirm="logout" />
  </q-layout>
</template>

<script setup lang="ts">
import ModalProfile from 'src/components/Modales/ModalProfile.vue';
import { ref } from 'vue';
import DraggerPrincipal from 'src/components/DraggerPrincipal.vue';
import { Ref } from 'vue';
import { getChildrensRouteAuth } from 'src/router/routes';
import { AuthService } from 'src/logica/auth/AuthService';
import { useRouter } from 'vue-router';
import ModalConfirmacion from 'src/components/Modales/ModalConfirmacion.vue';

// se obtiene el enrrutador
const router = useRouter()

defineOptions({
  name: 'MainLayout'
});

// Se definen las variables reactivas del componente
const draggerPrincipal: Ref<InstanceType<typeof DraggerPrincipal> | null> =
  ref(null);
// se crea una variable para el modal
const modalConfirmacion: Ref<InstanceType<typeof ModalConfirmacion> | null> =
  ref(null);

const rutasList = getChildrensRouteAuth('principal')

// Eventos

function logout() {
  AuthService.getInstancie().logout() // se cierra sesión
  // se redirige a la página del login
  router.push({ name: "Login" })
}
function changeDragger() {
  draggerPrincipal.value?.changeDrawer()
}

function activarModalConfirmacion() {
  modalConfirmacion.value?.activateModalConfirmacion() // se activa el modal confirmación
}
</script>

<style>
.rutas {
  display: flex;
  flex-direction: column;
}

.div-lateral {
  display: flex;
  gap: 16px;
}
</style>
