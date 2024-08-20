<template>

  <span class="text-h3">Login</span>
  <q-separator spaced />

  <div class="row justify-center">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-xs col-sm-12 col-md-6 q-pt-xl">
      <q-input filled v-model="datosLogin.nameUser" label="User Name *" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'This field is required',
        (val) =>
          /^[a-zA-Z0-9]*$/.test(val) || 'No special characters allowed',
      ]" />

      <q-input filled type="password" v-model="datosLogin.password" label="Password *" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'This field is required',
      ]" />

      <div>
        <q-btn label="Login" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>

</template>
<script setup lang="ts">
import { AuthService } from 'src/logica/auth/AuthService';
import { BadRequestError } from 'src/utils/BadRequestError';
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

// se inyecta el servicio de Auth
const authService: AuthService = AuthService.getInstancie()

// se crea un router
const router = useRouter()
interface DatosLogin {
  nameUser: string
  password: string
}
const datosLogin: Ref<DatosLogin> = ref({
  nameUser: "",
  password: ""
})

async function onSubmit() {
  try {
    // se intenta el logeo
    await authService.login(datosLogin.value.nameUser, datosLogin.value.password)
    // si no hay problemas en el logeo se redirige a la pagina principal
    router.push({ name: "principal" })
  } catch (error) {
    if (error instanceof BadRequestError)
      alert(error.message)
    else
      alert(error)
  }
}

function onReset() {
  datosLogin.value.nameUser = ""
  datosLogin.value.password = ""
}

</script>
