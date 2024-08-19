<template>
  <q-page class="q-ma-md">
    <span class="text-h3">Login</span>
    <q-separator spaced />

    <div class="row justify-center">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-xs col-sm-12 col-md-6 q-pt-xl"
      >
        <q-input
          filled
          v-model="userForm.user"
          label="User Name *"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'This field is required',
            (val) =>
              /^[a-zA-Z0-9]*$/.test(val) || 'No special characters allowed',
          ]"
        />

        <q-input
          filled
          type="password"
          v-model="userForm.password"
          label="Password *"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'This field is required',
          ]"
        />

        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Forms',
  setup() {
    const userForm = ref({
      user: '',
      password: '',
      conditions: false,
      errorInConditions: false,
    });

    return {
      userForm,

      onSubmit() {
        console.log(userForm.value);
      },

      onReset() {
        userForm.value = {
          user: '',
          password: '',
          conditions: false,
          errorInConditions: false,
        };
      },
    };
  },
});
</script>
