import MainLayout from 'src/layouts/MainLayout.vue';
import DriverPage from 'src/pages/DriverPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import NomencladoresPage from 'src/pages/NomencladoresPage.vue';
import { RouteRecordRaw } from 'vue-router';

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
          icon: 'home'
        }
      },
      {
        path: '/driverPage',
        name: 'Chóferes',
        component: DriverPage,
        meta: {
          icon: 'supervisor_account'
        },
        children: []
      },
      {
        path: '/vehiclesPage',
        name: 'Vehículos',
        component: DriverPage,
        meta: {
          icon: 'directions_car'
        },
        children: []
      },
      {
        path: '/NomencladoresPage',
        name: 'Nomencladores',
        component: NomencladoresPage,
        meta: {
          icon: 'settings'
        },
        children: []
      }
    ],
  },
];

// Función para encontrar una ruta por su nombre
export function findRouteByName(name: string): RouteRecordRaw | undefined {
  return routes.find((route) => route.name === name);
}

export default routes;
