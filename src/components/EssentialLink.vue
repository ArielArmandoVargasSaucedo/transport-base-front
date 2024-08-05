<template>
  <q-route-tab :to="props.ruta"  />
</template>

<script setup lang="ts">
defineOptions({
  name: 'EssentialLink'
});

export interface Props {
  ruta: {
    name: string
  }
};

const props: Props = defineProps<Props>()


</script>
