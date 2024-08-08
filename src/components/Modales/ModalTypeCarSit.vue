<template>
    <div class="q-pa-md">

        <q-dialog v-model="showModal">
            <q-card class="card-campo">


                <q-card-section class="bg-primary text-white">Formulario Tipo de Situación de los Carros</q-card-section>

                <q-card-section>
                    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                        <q-input filled v-model="datosTypeCarSit.nombre" label="Nombre Tipo de Situación del Carro *" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Por favor complete este campo']" />

                        <q-card-section>
                            <q-btn label="Submit" type="submit" color="primary"  />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </q-card-section>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script lang="ts" setup>

import { Ref, ref } from 'vue';

// Se definen las props del componente


// Se definen los emit del componente
const emit = defineEmits<{
    (e: 'postTypeCarSituations', nombre: string): Promise<void>
}>()

// Se define la interfaz para representar los datos del Campo

interface DatosTypeCarSit {
    nombre: string
    }

// Se definen las variables reactivas del componente
const showModal = ref(false)
const datosTypeCarSit: Ref<DatosTypeCarSit> = ref<DatosTypeCarSit>({
    nombre: "",
})


// Funciones

async function onSubmit() {
 await emit('postTypeCarSituations', datosTypeCarSit.value.nombre)
}

async function onReset() {
  datosTypeCarSit.value.nombre = ''
}

function setShowModal(estado: boolean) {
    showModal.value = estado
    // Luego de cambiar de estado, se limpian los campos
    // Siempre que se activa el modal se vuelven a establecer los valores por defecto
    onReset()
}

// Se definen las funciones que expone el componente
defineExpose({ setShowModal })

</script>

<style scoped>
.card-campo {
    width: 600px;
}
</style>