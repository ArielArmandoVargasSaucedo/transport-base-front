<template>
  <div class="q-pa-md">
    <q-dialog v-model="showModal">
      <q-card class="card-campo">
        <q-card-section class="bg-primary text-white"
          >Formulario Tipo de Situación de las Programaciones</q-card-section
        >

        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="datosTypeProgram.nombre"
              label="Nombre Tipo de Situación de la Programación *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />

            <q-card-section>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </q-card-section>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ProgramTypeDTO } from 'src/logica/programTypes/ProgramTypeDTO';
import { onUpdated, Ref, ref } from 'vue';

// Se definen las props del componente

interface Props {
  typeReactivo: {
    typeSeleccionado?: ProgramTypeDTO,
  }
}
const props: Props = defineProps<Props>()

onUpdated(onReset)


// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'postTypeProgram', nombre: string): Promise<void>;
    (e: 'updateTypeProgram', id: number, nombre: string): Promise<void>;
}>();

// Se define la interfaz para representar los datos del Campo

interface DatosTypeProgram {
  nombre: string;
}

// Se definen las variables reactivas del componente
const showModal = ref(false);
const datosTypeProgram: Ref<DatosTypeProgram> = ref<DatosTypeProgram>({
  nombre: '',
});

// Funciones

async function onSubmit() {

  if (!props.typeReactivo.typeSeleccionado) {
    await emit('postTypeProgram', datosTypeProgram.value.nombre);
  }
  else {
    await emit('updateTypeProgram', props.typeReactivo.typeSeleccionado.id_aut_prog_type, datosTypeProgram.value.nombre)
  }
}

async function onReset() {

  if (!props.typeReactivo.typeSeleccionado) {
    datosTypeProgram.value.nombre = '';

  }
  else {
    datosTypeProgram.value.nombre = props.typeReactivo.typeSeleccionado.prog_type_name
  }
}

function setShowModal(estado: boolean) {
  showModal.value = estado;
  // Luego de cambiar de estado, se limpian los campos
  // Siempre que se activa el modal se vuelven a establecer los valores por defecto
  }

// Se definen las funciones que expone el componente
defineExpose({ setShowModal });
</script>

<style scoped>
.card-campo {
  width: 600px;
}
</style>

