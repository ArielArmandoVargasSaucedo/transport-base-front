<template>
  <q-layout view="hHh LpR lFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          TransportBase
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" behavior="desktop" elevated>
      <q-tabs class="rutas" >
        <EssentialLink v-for="ruta in rutasList" :key="ruta.name" :ruta="ruta" />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { findRouteByName } from 'src/router/routes';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import EssentialLink from 'src/components/EssentialLink.vue';



defineOptions({
  name: 'MainLayout'
});

const rutaPrincipal: RouteRecordRaw | undefined = findRouteByName('principal')
const rutasList = rutaPrincipal?.children

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style>
.rutas {
  display: flex;
  flex-direction: column;
}
</style>
