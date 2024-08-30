<template>
  <q-page class="row items-center justify-evenly container">
    <q-page padding>



      <div class="container-time">
        <InfoLine :info-lines="timeline_list1" :title="$t('timelineList1.analisisCriticidad')" />
        <InfoLine :info-lines="timeline_list2" :title="$t('timelineList2.metodosImpactos')" />
        <InfoLine :info-lines="timeline_list3" :title="$t('timelineList3.tecnicaPareto')" />
      </div>
    </q-page>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Todo, Meta } from 'components/models';
import InfoLine from 'src/components/InfoLine.vue';


const timeline_list1 = [
  {
    title: 'Tabla de frecuencias',
    side: 'left',
    desc: 'Construcción de la tabla de frecuencias acumuladas de Ocurrencia, organizando las frecuencias de ocurrencia, de mayor a menor.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Definición del nivel de relevancia',
    side: 'left',
    desc: 'Determinación de la importancia de las clases para la Ocurrencia',
    color: 'orange',
    icon: 'done_all'
  }
]
const timeline_list2 = [
  {
    title: 'Índices de deterioro',
    side: 'left',
    desc: 'Determinación de los índices de frecuencia, impacto y detectabilidad.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Criticidad calculable',
    side: 'left',
    desc: 'Cálculo del índice de criticidad por la ecuación C=F*I*D',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Jerarquía de entidades',
    side: 'left',
    desc: 'Jerarquización de los deterioros por sistemas y subsistemas',
    color: 'blue',
    icon: 'thumb_up'
  }, {
    title: 'Niveles de criticidad',
    side: 'left',
    desc: 'Determinación de los niveles de criticidad por la matriz patrón',
    color: 'yellow',
    icon: 'done_all'
  }
]

const timeline_list3 = [
  {
    title: 'Evaluación por deterioro',
    side: 'left',
    desc: 'Evaluación de cada deterioro analizando todos los parámetros.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Categorización de deterioros',
    side: 'left',
    desc: 'Sumatoria de las categorías en cada deterioro.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Homologación de criterios',
    side: 'left',
    desc: 'Determinación de la categoría definitiva y homologación con los criterios de criticidad ',
    color: 'blue',
    icon: 'thumb_up'
  }
]





defineOptions({
  name: 'IndexPage'
});

const todos = ref<Todo[]>([
  // Inicializa aquí tus tareas
]);

const meta = ref<Meta>({
  totalCount: 1200
});
</script>

<style scoped>
.container {
  background-image: url("src/images/pantalla_principal.jpg");
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
