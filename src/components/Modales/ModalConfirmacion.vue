<template>

    <q-dialog v-model="alert">
        <q-card>
            <q-card-section>
                <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                {{ props.text }}
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="CONFIRM" color="primary" v-close-popup @click="confirmAction" />
                <q-btn flat label="CANCEL" color="primary" v-close-popup @click="desactivarModalConfirmacion" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { Prop, ref } from 'vue';

// Se definen las variables reactivas
const alert = ref(false)

// Se definen las Props del componente

interface Props {
    text: string // el texto que mostrará el componente al usuario
}

const props: Props = defineProps<Props>()

// Se definen los emits del componente
const emit = defineEmits<{
    (e: 'actionConfirm'): void
}>()


// Operaciones

// Función para activar el modal de la eliminación
const activateModalConfirmacion = () => {
    alert.value = true
}

// Función para desactivar el modal de la eliminación
const desactivarModalConfirmacion = () => {
    alert.value = false
}

// Función para confirmar la acción 
const confirmAction = () => {
    emit("actionConfirm")
}

// se definen las funciones que expone el componente
defineExpose({ activateModalConfirmacion })
</script>

<style></style>