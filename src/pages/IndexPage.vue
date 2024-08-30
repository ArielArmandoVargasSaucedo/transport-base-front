<template>
  <q-page class="row items-center justify-evenly container">
    <q-page padding>



      <div class="container-time">
        <InfoLine :info-lines="timeline_list1" :title="titulo1" />
        <InfoLine :info-lines="timeline_list2" :title="titulo2" />
        <InfoLine :info-lines="timeline_list3" :title="titulo3" />
        <InfoLine :info-lines="timeline_list4" :title="titulo4" />
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
const titulo4 = 'Gestión de Vehículos'

const timeline_list1 = [
  {
    title: 'Registro de choferes',
    side: 'left',
    desc: 'Proceso de inscripción de nuevos choferes en el sistema.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Asignación de Vehículo',
    side: 'left',
    desc: ' Distribución de Vehículos a los choferes.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Creación de las situaciones de los choferes',
    side: 'left',
    desc: ' Asignación de tipos de situaciones disponibles de los Choferes. ',
    color: 'blue',
    icon: 'thumb_up'
  }
]
const timeline_list2 = [
  {
    title: 'Creación de usuarios',
    side: 'left',
    desc: 'Proceso de alta de nuevos usuarios en el sistema, asignación de roles y permisos.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Actualización de información',
    side: 'left',
    desc: 'Mantenimiento y actualización de los datos de los usuarios.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Gestión de permisos',
    side: 'left',
    desc: ' Administración y control de los permisos de acceso de los usuarios, asegurando que cada usuario tenga los privilegios adecuados según su rol.',
    color: 'blue',
    icon: 'thumb_up'
  }
]

const timeline_list3 = [
  {
    title: ' Recepción de solicitudes',
    side: 'left',
    desc: 'Registro de las solicitudes recibidas de los usuarios.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Procesamiento de solicitudes',
    side: 'left',
    desc: 'Revisión y gestión de las solicitudes , incluyendo la verificación de disponibilidad, la asignación de choferes y vehículos, y la confirmación de itinerarios .',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Asignación de rutas',
    side: 'left',
    desc: 'Distribución de las rutas y duración del viaje.',
    color: 'blue',
    icon: 'thumb_up'
  }
]
const timeline_list4 = [
  {
    title: ' Registro de vehículos',
    side: 'left',
    desc: 'Proceso de inscripción de nuevos vehículos en el sistema.',
    color: 'red',
    icon: 'thumb_up'
  },
  {
    title: 'Asignación de vehículos',
    side: 'left',
    desc: 'Asignación de los vehículos según su disponibilidad.',
    color: 'orange',
    icon: 'done_all'
  }, {
    title: 'Exportar información',
    side: 'left',
    desc: 'Exportar en formato excel las situciones de los vehículos.',
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
