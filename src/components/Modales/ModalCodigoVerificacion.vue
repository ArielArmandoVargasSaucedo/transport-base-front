<template>
    <q-card class="activation-card">
      <q-card-section>
        <q-banner class="banner-primary q-mb-md q-py-md">
          <div class="banner-content">
            <q-icon name="security" size="lg"   />
            <span class="text-h5 ">{{ titulo }}</span>
          </div>
        </q-banner>
  
        <q-card-section class="q-px-none q-py-sm text-center">
          <p class="text-subtitle1 q-mb-lg">{{ parrafo }}</p>
  
          <q-input
            v-model="activationCode"
            label="Código de Activación"
            filled
            dense
            autofocus
            class="q-mb-md code-input"
            :rules="[codeValidator]"
          />
  
          <q-btn
            @click="submitCode"
            :label="nombreBoton"
            color="primary"
            unelevated
            class="full-width q-mb-lg"
          />
        </q-card-section>
  
        <q-banner class="banner-negative q-mt-md q-py-md">
          <div class="banner-content">
            <q-icon name="info" size="lg"  />
            <span>{{ informacion }}</span>
          </div>
        </q-banner>
      </q-card-section>
    </q-card>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  // Definición de Props
  interface Props {
    titulo: string;
    parrafo: string;
    informacion: string;
    nombreBoton: string;
  }
  
  const props = defineProps<Props>();
  
  // Definición de Emits
  const emit = defineEmits<{
    (e: 'action', codigoVerificacion: string): void;
  }>();
  
  // Variables reactivas
  const activationCode = ref<string>('');
  
  // Función para validar el código de activación
  const codeValidator = (val: string) => {
    return val.length === 8 || 'El código debe tener 8 dígitos';
  };
  
  // Función para enviar el código de activación
  const submitCode = () => {
    if (activationCode.value.length === 8) {
      emit('action', activationCode.value);
    } else {
      alert('El código debe tener 8 dígitos');
    }
  };
  </script>
  
  <style scoped>
  .activation-card {
    max-width: 450px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .banner-primary, .banner-negative {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }
  
  .banner-primary {
    background-color: var(--q-color-primary);
   
  }
  
  .banner-negative {
    background-color: var(--q-color-negative);
 
  }
  
  .banner-content {
    display: flex;
    align-items: center;
    gap: 26px;
  }
  
  .icon-highlight {
    margin-right: 12px;
    color: white;
  }
  
  .code-input {
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .full-width {
    width: 100%;
  }
  
  .text-center {
    text-align: center;
  }
  
  .font-bold {
    font-weight: 600;
  }
  </style>
  