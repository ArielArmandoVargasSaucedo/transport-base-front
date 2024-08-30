<template>
  <q-page class="row items-center justify-evenly container">
    <q-page padding>



      <div class="container-time">
        <InfoLine :info-lines="timeline_list1" :title="titulo1" />
        <InfoLine :info-lines="timeline_list2" :title="titulo2" />
        <InfoLine :info-lines="timeline_list3" :title="titulo3" />
      </div>
    </q-page>
  </q-page>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
// import { Todo, Meta } from 'components/models';
import InfoLine from 'src/components/InfoLine.vue';

const titulo1 = 'Gestión de Choferes'
const titulo2 = 'Gestión de Usuario'
const titulo3 = 'Gestión de Solicitudes'

const timeline_list1 = [
  {
    title: 'Registro de Choferes',
    side: 'left',
    desc: 'Proceso de inscripción de nuevos choferes en el sistema.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Asignación de Rutas',
    side: 'left',
    desc: ' Distribución de rutas y horarios a los choferes según disponibilidad y necesidades operativas.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Evaluación de Desempeño',
    side: 'left',
    desc: 'Seguimiento continuo y análisis detallado del rendimiento de los choferes para garantizar un servicio de alta calidad  ',
    color: 'blue',
    icon: 'thumb_up'
  }
]
const timeline_list2 = [
  {
    title: 'Creación de Usuarios',
    side: 'left',
    desc: 'Proceso de alta de nuevos usuarios en el sistema, asignación de roles y permisos.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Actualización de Información',
    side: 'left',
    desc: 'Mantenimiento y actualización de los datos de los usuarios.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Gestión de Permisos',
    side: 'left',
    desc: ' Administración y control de los permisos de acceso de los usuarios, asegurando que cada usuario tenga los privilegios adecuados según su rol.',
    color: 'blue',
    icon: 'thumb_up'
  }
]

const timeline_list3 = [
  {
    title: ' Recepción de Solicitudes',
    side: 'left',
    desc: 'Registro de las solicitudes recibidas de los usuarios.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Procesamiento de Solicitudes',
    side: 'left',
    desc: 'Revisión y gestión de las solicitudes , incluyendo la verificación de disponibilidad, la asignación de choferes y vehículos, y la confirmación de itinerarios .',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Seguimiento y Cierre',
    side: 'left',
    desc: 'Monitoreo del estado de las solicitudes y confirmación de su resolución y cierre.',
    color: 'blue',
    icon: 'thumb_up'
  }
]





defineOptions({
  name: 'IndexPage'
});

// const todos = ref<Todo[]>([
//   // Inicializa aquí tus tareas
// ]);

// const meta = ref<Meta>({
//   totalCount: 1200
// });
</script>

<style scoped>
.container {
  background-image: url("src/images/fondo-login4.jpg");
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
