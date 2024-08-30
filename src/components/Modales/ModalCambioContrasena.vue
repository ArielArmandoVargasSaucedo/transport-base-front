<template>
  <q-card class="password-reset-card">
    <q-card-section>
      <q-banner class="banner-primary q-mb-md q-py-md">
        <div class="banner-content">
          <q-icon name="lock_reset" size="lg" />
          <span class="text-h5 font-bold">{{ $t('cambioContraseña.cambio') }}</span>
        </div>
      </q-banner>

      <q-card-section class="q-px-none q-py-sm text-center">
        <p class="text-subtitle1 q-mb-lg">
          {{ $t('cambioContraseña.porFavor') }}
        </p>

        <q-input v-model="newPassword" :label="$t('cambioContraseña.nueva')" type="password" filled dense autofocus
          class="q-mb-md password-input" :rules="[passwordValidator]" />

        <q-input v-model="confirmPassword" :label="$t('cambioContraseña.confirmar')" type="password" filled dense
          class="q-mb-md password-input" :rules="[confirmPasswordValidator]" />

        <q-btn @click="submitPassword" :label="$t('cambioContraseña.cambiar')" color="primary" unelevated
          class="full-width q-mb-lg" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from 'src/logica/auth/AuthService';
import { BadRequestError } from 'src/utils/BadRequestError';

// Se inyecta el servicio de auth service
const authService: AuthService = AuthService.getInstancie();
let idUsuario: number = -1; // representa el id del usuario

// Se obtiene la ruta actual
const route = useRoute();
const router = useRouter();

// Se obtienen los parámetros de la url
if (typeof route.params.idUsuario === 'string') {
  idUsuario = parseInt(route.params.idUsuario);
}

// Se definen las variables reactivas del componente
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');

// Validadores de entrada
const passwordValidator = (val: string) =>
  !!val || 'La contraseña es obligatoria';
const confirmPasswordValidator = (val: string) =>
  val === newPassword.value || 'Las contraseñas no coinciden';

const submitPassword = async () => {
  if (newPassword.value && confirmPassword.value === newPassword.value) {
    // Lógica para manejar el cambio de contraseña
    try {
      await authService.changePassword(idUsuario, newPassword.value);
      alert(
        'Su contraseña ha sido cambiada con éxito. Ahora puede iniciar sesión con su nueva contraseña.'
      );
      // Redirige al login después de cambiar la contraseña
      router.push({ name: 'Login' });
    } catch (error) {
      if (error instanceof BadRequestError) {
        alert(error.message);
      } else if (error instanceof TypeError) {
        // si se trata de un error de conexión
        alert('Hubo un problema de conexión. Por favor, intente nuevamente.');
      }
    }
  } else {
    alert(
      'Por favor, asegúrese de que las contraseñas coincidan y tengan al menos 8 caracteres.'
    );
  }
};
</script>

<style scoped>
.password-reset-card {
  max-width: 450px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.banner-primary {
  background-color: var(--q-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 26px;
}

.icon-highlight {
  margin-right: 12px;

}

.password-input {
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
