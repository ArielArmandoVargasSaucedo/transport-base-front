import MainLayout from 'src/layouts/MainLayout.vue';
import DriverPage from 'src/pages/DriverPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'principal',
    component: MainLayout,
    children: [
      {
        path: '/indexPage',
        name: 'indexPage',
        component: IndexPage,
      },
      {
        path: '/driverPage',
        name: 'driverPage',
        component: DriverPage,
      },
    ],
  },
];

// Función para encontrar una ruta por su nombre
export function findRouteByName(name: string): RouteRecordRaw | undefined {
  return routes.find((route) => route.name === name);
}

export default routes;
