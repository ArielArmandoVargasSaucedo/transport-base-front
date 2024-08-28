<template>
  <div class="q-pa-md">
    <q-dialog v-model="showModal">
      <q-card class="card-campo">
        <q-card-section class="bg-primary text-white">Formulario Tipo de Situación de los Choferes</q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input filled v-model="datosTypeDriverSit.nombre" label="Nombre Tipo de Situación del Chofer *" lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor complete este campo',
              ]" />
            <q-checkbox v-model="datosTypeDriverSit.is_fecha" label="Desea que la situación tenga fecha de retorno?" :disable="!isOpenToInsert()" />
            <q-card-section>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </q-card-section>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { RefSymbol } from '@vue/reactivity';
import { TypeDriverSituationDTO } from 'src/logica/typeDriverSituation/TypeDriverSituationDTO';
import { onUpdated, Ref, ref } from 'vue';

// Se definen las props del componente

interface Props {
  typeReactivo: {
    typeSeleccionado?: TypeDriverSituationDTO,
  }
}
const props: Props = defineProps<Props>()

onUpdated(onReset)

// Se definen los emit del componente
const emit = defineEmits<{
  (e: 'postTypeDriverSituations', nombre: string, is_fecha: boolean): Promise<void>;
  (e: 'updateTypeDriverSituations', id: number, nombre: string): Promise<void>;
}>();


// Se define la interfaz para representar los datos del Campo

interface DatosTypeDriverSit {
  nombre: string;
  is_fecha: boolean;
}

// Se definen las variables reactivas del componente
const showModal = ref(false);
const datosTypeDriverSit: Ref<DatosTypeDriverSit> = ref<DatosTypeDriverSit>({
  nombre: '',
  is_fecha: false,
});

// Funciones

async function onSubmit() {
  if (!props.typeReactivo.typeSeleccionado) {
    await emit('postTypeDriverSituations', datosTypeDriverSit.value.nombre, datosTypeDriverSit.value.is_fecha);
  }
  else {
    await emit('updateTypeDriverSituations', props.typeReactivo.typeSeleccionado.id_aut_type_ds, datosTypeDriverSit.value.nombre)

  }

}

async function onReset() {
  if (!props.typeReactivo.typeSeleccionado) {
    datosTypeDriverSit.value.nombre = '';
    datosTypeDriverSit.value.is_fecha = false;
  }
  else {
    datosTypeDriverSit.value.nombre = props.typeReactivo.typeSeleccionado.type_ds_name
    datosTypeDriverSit.value.is_fecha = props.typeReactivo.typeSeleccionado.is_return
  }

}

function setShowModal(estado: boolean) {
  showModal.value = estado;

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
