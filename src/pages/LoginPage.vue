<template>
  <div class="flex flex-center container">
    <div>
      <q-avatar size="100px" font-size="52px" color="primary" text-color="white" icon="person" />
    </div>

    <q-card class="spa">
      <q-card-section>
        <span class="text-h3 log">{{ $t('login.login') }}
          <internationalizationButton color="primary" class="internationalitation" />
        </span>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <q-input class="full-width inp" clearable filled v-model="datosLogin.nameUser"
            :label="$t('login.nombreUsuario')" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
              (val) =>
                /^[a-zA-Z0-9]*$/.test(val) || 'No special characters allowed',
            ]">
            <template v-slot:before>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <q-input class="full-width inp" clearable filled :type="showPassword ? 'text' : 'password'"
            v-model="datosLogin.password" :label="$t('login.contraseña')" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
            ]">
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" @click="togglePasswordVisibility" />
            </template>
            <template v-slot:before>
              <q-icon name="lock" color="primary" />
            </template>
          </q-input>

          <div>
            <q-btn label="Login" type="submit" color="primary" class="btn" />
            <router-link :to="{ name: 'Verificacion de Identidad' }">{{ $t('login.olvidadoContrasena') }}</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { AuthService } from 'src/logica/auth/AuthService';
import { BadRequestError } from 'src/utils/BadRequestError';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import internationalizationButton from 'src/components/internationalizationButton.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// se inyecta el servicio de Auth
const authService: AuthService = AuthService.getInstancie()

const { t } = useI18n();

// se crea un router
const router = useRouter()
interface DatosLogin {
  nameUser: string
  password: string
}
const datosLogin: Ref<DatosLogin> = ref({
  nameUser: '',
  password: ''
})

const showPassword = ref(false);

//mostrar contraseña
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function onSubmit() {
  try {
    // se intenta el logeo
    await authService.login(datosLogin.value.nameUser, datosLogin.value.password)
    // si no hay problemas en el logeo se redirige a la pagina principal
    router.push({ name: 'principal' })
    router.push({ name: 'Página Principal' })
  } catch (error) {
    if (error instanceof BadRequestError)
      Notify.create({
        message: t('login.error'),
        type: 'negative', // Cambia el tipo a 'negative', 'warning', 'info', etc.
        color: 'red', // Cambia el color de la notificación
        position: 'bottom-right', // Cambia la posición a 'top', 'bottom', 'left', 'right', etc.
        timeout: 3000, // Cambia la duración de la notificación en milisegundos
        icon: 'cancel', // Añade un icono a la notificación
      })
    else
      alert(error)
  }
}

function onReset() {
  datosLogin.value.nameUser = ''
  datosLogin.value.password = ''
}
</script>

<style scoped>
.container {
  background-image: url("src/images/fondo-login3.jpg");
  padding: 120px;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.log {
  display: flex;
  justify-content: flex-end;
}

.inp {
  margin: 20px;
}

.spa {
  padding: 20px;
  width: 600px;
}

.internationalitation {
  margin-left: 150px;
}

.btn {
  width: 100%;
  margin: 10px;
}
</style>
