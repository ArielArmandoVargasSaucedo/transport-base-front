import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { AuthService } from 'src/logica/auth/AuthService';
import { RolesEnum } from 'src/utils/RolesEnum';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Metodo que define la acción ejecutar en cualquier cambio de ruta
  Router.beforeEach((to, from, next) => {
    // Se ejecuta una comprobación de logeo
    // lo primero es obtener el token
    const token = AuthService.getInstancie().getJwt()

    // si la ruta a la que se viaja necista autorización y el usuario no esta logeado (no tiene el token)
    if (to.meta.needLogin && !token) {
      // se redirige al usuario al login
      next({ name: "Login" })
    }
    else if ('roles' in to.meta && !AuthService.getInstancie().verificarRol(to.meta.roles as Array<RolesEnum>)) { // si la ruta cuenta con permisos de roles y si la ruta destino no cuenta con los permisos necesarios
      // se dirige a página de Error
      alert("No tiene acceso a esta página")
      next(from)
    }
    else { // en caso de que este logeado y tenga permisos de rol para entrar a la ruta
      next()
    }
  })


  return Router;
});

