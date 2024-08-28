<template>
  <div class="q-pa-md">
    <q-dialog v-model="showModal">
      <q-card class="card-campo">
        <q-card-section class="bg-primary text-white"
          >Formulario Tipo de Situación de los Carros</q-card-section
        >

        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="datosTypeCarSit.nombre"
              label="Nombre Tipo de Situación del Carro *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]"
            />
            <q-checkbox v-model="datosTypeCarSit.is_fecha" label="Desea que la situación tenga fecha de retorno?" :disable="!isOpenToInsert()" />
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
import { TypeCarSituationDTO } from 'src/logica/typeCarSituation/TypeCarSituationDTO';
import { onUpdated } from 'vue';
import { Ref, ref } from 'vue';

// Se definen las props del componente
interface Props {
  typeReactivo: {
    typeSeleccionado?: TypeCarSituationDTO,
  }
}
const props: Props = defineProps<Props>()

onUpdated(onReset)
// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'postTypeCarSituations', nombre: string, is_fecha: boolean): Promise<void>;
    (e: 'updateTypeCarSituations', id: number, nombre: string): Promise<void>;
}>();

// Se define la interfaz para representar los datos del Campo

interface DatosTypeCarSit {
  nombre: string;
  is_fecha: boolean;
}

// Se definen las variables reactivas del componente
const showModal = ref(false);
const datosTypeCarSit: Ref<DatosTypeCarSit> = ref<DatosTypeCarSit>({
  nombre: '',
  is_fecha: false,
});

// Funciones

async function onSubmit() {
  if (!props.typeReactivo.typeSeleccionado) {
    await emit('postTypeCarSituations', datosTypeCarSit.value.nombre, datosTypeCarSit.value.is_fecha);
  }
  else {
    await emit('updateTypeCarSituations', props.typeReactivo.typeSeleccionado.id_aut_type_cs, datosTypeCarSit.value.nombre);
  }
}

async function onReset() {

  if (!props.typeReactivo.typeSeleccionado) {
    datosTypeCarSit.value.nombre = '';
    datosTypeCarSit.value.is_fecha = false;
  }
  else {
    datosTypeCarSit.value.nombre = props.typeReactivo.typeSeleccionado.type_cs_name
    datosTypeCarSit.value.is_fecha = props.typeReactivo.typeSeleccionado.is_return
  }
}

function setShowModal(estado: boolean) {
  showModal.value = estado;
  // Luego de cambiar de estado, se limpian los campos
  // Siempre que se activa el modal se vuelven a establecer los valores por defecto

}

function isOpenToInsert () {
  return !props.typeReactivo.typeSeleccionado
}

// Se definen las funciones que expone el componente
defineExpose({ setShowModal });
</script>

<style scoped>
.card-campo {
  width: 600px;
}
</style>
