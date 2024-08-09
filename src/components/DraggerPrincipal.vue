<template>
  <q-drawer v-model="drawer" show-if-above :width="230" :breakpoint="500" bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white-3'">
    <q-scroll-area class="fit">
      <q-list>

        <template v-for="(ruta, index) in props.rutas" :key="index">
          <q-item :to="ruta" clickable :active="isClikeada(ruta.name)" v-ripple>
            <q-item-section avatar>
              <q-icon :name="(ruta.meta?.icon as string)" />
            </q-item-section>
            <q-item-section>
              {{ ruta.name?.toString() }}
            </q-item-section>
          </q-item>
        </template>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouteRecordNameGeneric, RouteRecordRaw, useRoute } from 'vue-router';


// se definen las props del componente
interface Props {
  rutas: Array<RouteRecordRaw> | undefined
}

const props: Props = defineProps<Props>()

// se definen las variables reactivas del componente
const drawer = ref(true)



function changeDrawer() {
  if (drawer.value) // si está activado
    drawer.value = false
  else // si no está activado
    drawer.value = true
}

// funcion para determinar si una ruta está clickeada
function isClikeada(name: RouteRecordNameGeneric  /*Representa el nombre de la ruta*/): boolean {
  // se obtiene la ruta actual
  const rutaActual = useRoute()

  return rutaActual.name === name // si los nombres son iguales es que esta seleccionada
}

defineExpose({ changeDrawer })
</script>

<style></style>