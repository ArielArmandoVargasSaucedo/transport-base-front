import MainLayout from 'src/layouts/MainLayout.vue';
import DriverPage from 'src/pages/DriverPage.vue';
import CarPage from 'src/pages/CarPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import NomencladoresPage from 'src/pages/NomencladoresPage.vue';
import LoginPage from 'src/pages/LoginPage.vue';
import AdminPage from 'src/pages/AdminPage.vue';
import { RouteRecordRaw } from 'vue-router';
import SolicitudePage from 'src/pages/SolicitudePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'principal',
    component: MainLayout,
    children: [
      {
        path: '/indexPage',
        name: 'Página Principal',
        component: IndexPage,
        meta: {
          icon: 'home',
        },
      },
      {
        path: '/driverPage',
        name: 'Choferes',
        component: DriverPage,
        meta: {
          icon: 'supervisor_account',
        },
        children: [],
      },
      {
        path: '/vehiclesPage',
        name: 'Vehículos',
        component: CarPage,
        meta: {
          icon: 'directions_car',
        },
        children: [],
      },
      {
        path: '/SolicitudePage',
        name: 'Solicitudes',
        component: SolicitudePage,
        meta: {
          icon: 'newspaper',
        },
        children: [],
      },
      {
        path: '/NomencladoresPage',
        name: 'Nomencladores',
        component: NomencladoresPage,
        meta: {
          icon: 'settings',
        },
        children: [],
      },
      {
        path: '/LoginPage',
        name: 'Login',
        component: LoginPage,
        meta: {
          icon: 'login',
        },
        children: [],
      },
      {
        path: '/AdminPage',
        name: 'AdminPage',
        component: AdminPage,
        meta: {
          icon: 'user',
        },
        children: [],
      },
    ],
  },
];

// Función para encontrar una ruta por su nombre
export function findRouteByName(name: string): RouteRecordRaw | undefined {
  return routes.find((route) => route.name === name);
}

export default routes;
