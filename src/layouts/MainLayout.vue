<template>
  <q-layout view="hHh LpR lFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="changeDragger()" />

        <q-toolbar-title>
          TransportBase
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

  <DraggerPrincipal ref="draggerPrincipal" :rutas="rutasList" />
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { findRouteByName } from 'src/router/routes';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import DraggerPrincipal from 'src/components/DraggerPrincipal.vue';
import { Ref } from 'vue';



defineOptions({
  name: 'MainLayout'
});

const draggerPrincipal: Ref<InstanceType<typeof DraggerPrincipal> | null> =
  ref(null);

const rutaPrincipal: RouteRecordRaw | undefined = findRouteByName('principal')
const rutasList = rutaPrincipal?.children



function changeDragger () {
draggerPrincipal.value?.changeDrawer()
}

</script>

<style>
.rutas {
  display: flex;
  flex-direction: column;
}
</style>
