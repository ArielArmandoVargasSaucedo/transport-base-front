<template>
  <q-route-tab :to="props.ruta" :label="props.ruta.name?.toString()"  />
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';

// Se definen las Props (Parametros) del componente
 interface Props {
  ruta: RouteRecordRaw
};

const props: Props = defineProps<Props>()

</script>
