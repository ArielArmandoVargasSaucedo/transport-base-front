import MainLayout from 'src/layouts/MainLayout.vue';
import DriverPage from 'src/pages/DriverPage.vue';
import CarPage from 'src/pages/CarPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import NomencladoresPage from 'src/pages/NomencladoresPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';
import AdminPage from 'src/pages/AdminPage.vue';
import { RouteRecordRaw } from 'vue-router';
import SolicitudePage from 'src/pages/SolicitudePage.vue';
import { RolesEnum } from 'src/utils/RolesEnum';
import { AuthService } from 'src/logica/auth/AuthService';
import GroupTourPage from 'src/pages/GroupTourPage.vue';
import CarSituationPage from 'src/pages/CarSituationPage.vue';
import IdentificacionCuentaPage from 'src/pages/IdentificacionCuentaPage.vue';
import CodigoVerificacionIdentidadPage from 'src/pages/CodigoVerificacionIdentidadPage.vue';
import CambioContrasenaPage from 'src/pages/CambioContrasenaPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'principal',
    component: MainLayout,
    meta: {
      needLogin: true // indica que se requiere estar autenticado
    },
    children: [
      {
        path: '/indexPage',
        name: 'Página Principal',
        component: IndexPage,
        meta: {
          icon: 'home',
          needLogin: true // indica que se requiere estar autenticado
        },
      },
      {
        path: '/driverPage',
        name: 'Choferes',
        component: DriverPage,
        meta: {
          icon: 'supervisor_account',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Directivo] // lista de roles con autorización para entrar a la ruta
        },
        children: [{
          path: 'driverSitPage/:idDriver',
          name: 'Situación del Chofer',
          component: CarSituationPage,
          meta: {
            icon: '',
            needLogin: true, // indica que se requiere estar autenticado
            roles: [RolesEnum.Directivo] // lista de roles con autorización para entrar a la ruta
          }
        },],
      },
      {
        path: '/vehiclesPage',
        name: 'Vehículos',
        component: CarPage,
        meta: {
          icon: 'directions_car',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Directivo] // lista de roles con autorización para entrar a la ruta
        },
        children: [{
          path: 'carSitPage/:idCar',
          name: 'Situación del Carro',
          component: CarSituationPage,
          meta: {
            icon: '',
            needLogin: true, // indica que se requiere estar autenticado
            roles: [RolesEnum.Directivo] // lista de roles con autorización para entrar a la ruta
          }
        },],
      },
      {
        path: '/SolicitudePage',
        name: 'Solicitudes',
        component: SolicitudePage,
        meta: {
          icon: 'newspaper',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Directivo, RolesEnum.Chofer] // lista de roles con autorización para entrar a la ruta
        },
        children: [],
      },
      {
        path: '/GroupTourPage',
        name: 'Grupo Turístico',
        component: GroupTourPage,
        meta: {
          icon: 'groups',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Directivo, RolesEnum.Chofer] // lista de roles con autorización para entrar a la ruta
        },
        children: [],
      },
      {
        path: '/NomencladoresPage',
        name: 'Nomencladores',
        component: NomencladoresPage,
        meta: {
          icon: 'settings',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Directivo] // lista de roles con autorización para entrar a la ruta
        },
        children: [],
      },
      {
        path: '/AdminPage',
        name: 'AdminPage',
        component: AdminPage,
        meta: {
          icon: 'supervisor_account',
          needLogin: true, // indica que se requiere estar autenticado
          roles: [RolesEnum.Administrador] // lista de roles con autorización para entrar a la ruta
        },
        children: [],
      },
    ],
  },
  {
    path: '/LoginPage',
    name: 'Login',
    component: LoginPage,
    meta: {
      icon: 'login',
      needLogin: false // indica que no se requiere estar autenticado
    },
    children: [],
  },
  {
    path: '/IdentificacionUsuario',
    name: 'Verificacion de Identidad',
    component: IdentificacionCuentaPage,
    meta: {
      needLogin: false // indica que no se requiere estar autenticado
    },
    children: [],
  },
  {
    path: '/CodigoVerificacion/:idUsuario',
    name: 'Codigo de Verificacion',
    component: CodigoVerificacionIdentidadPage,
    meta: {
      needLogin: false // indica que no se requiere estar autenticado
    },
    children: [],
  },
  {
    path: '/CambioContrasena/:idUsuario',
    name: 'Cambio de Contraseña',
    component: CambioContrasenaPage,
    meta: {
      needLogin: false // indica que no se requiere estar autenticado
    },
    children: [],
  }
];

// Función para obtener las rutas hijas de una ruta autorizadas para el usuario 
export function getChildrensRouteAuth(nameRoute: string): Array<RouteRecordRaw> {
  let routes: Array<RouteRecordRaw> = getChildrensRoute(nameRoute) // se obtiene la lista de hijos de la ruta


  return routes.filter((ruta) => {
    let isAuth = true // es una ruta autorizada hasta que se demuestre lo contrario
    // si la ruta cuenta con permisos de roles y si la ruta no cuenta con los permisos necesarios
    if (ruta.meta && 'roles' in ruta.meta && !AuthService.getInstancie().verificarRol(ruta.meta.roles as Array<RolesEnum>))
      isAuth = false

    return isAuth
  })
}

// Función para obtener las rutas de hijas de una ruta en específico
export function getChildrensRoute(nameRoute: string): Array<RouteRecordRaw> {
  let routes: Array<RouteRecordRaw> = Array<RouteRecordRaw>()

  // se encuentra a la ruta
  const ruta: RouteRecordRaw | undefined = getRoute(nameRoute)

  // si fue encontrada una ruta con ese nombre y si se encuentra, esa ruta tiene hijos
  if (ruta && ruta.children)
    routes = ruta.children


  return routes // retorna una lista vacía si no tiene hijos la ruta
}

export function getRoute(nameRoute: string): RouteRecordRaw | undefined {
  let ruta: RouteRecordRaw | undefined = undefined

  for (let index = 0; index < routes.length && !ruta; index++) {
    const route = routes[index];
    if (route.name === nameRoute) // si el nombre de la ruta del recorrido es igual a la ruta que se buscar
      ruta = route // se encuentra la ruta y se finaliza el ciclo
    else // de forma contraria
      ruta = getRouteInTheRoute(route, nameRoute) // se inicia un recorrido en profundidad por esa ruta para encontrar la ruta deseada
  }

  return ruta
}

function getRouteInTheRoute(rutaActual: RouteRecordRaw, nameRoute: string): RouteRecordRaw | undefined {
  let ruta: RouteRecordRaw | undefined = undefined

  if (rutaActual.children) {// si la ruta actual tiene childrens
    const childrens = rutaActual.children
    for (let index = 0; index < childrens.length && !ruta; index++) {
      const route = childrens[index];
      if (route.name === nameRoute)
        ruta = route
      else
        ruta = getRouteInTheRoute(route, nameRoute)
    }
  }

  return ruta
}

export default routes;
