import { createRouter, createWebHistory } from 'vue-router';
import CameraView from '../views/CameraView.vue';
import ProfilesView from '../views/ProfilesView.vue';
import Web5ConnectRequestView from '../views/Web5ConnectRequestView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'profiles',
      component: ProfilesView
    },
    {
      path: '/apps',
      name: 'apps',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AppsView.vue')
    },
    {
      path: '/web5-connect-request',
      name: 'web5-connect-request',
      component: Web5ConnectRequestView
    },
    // {
    //   path: '/create-profile',
    //   name: 'create-profile',
    //   component: CreateProfileView
    // },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView,  // Add a route for the Camera view
    },
  ]
})

export default router
