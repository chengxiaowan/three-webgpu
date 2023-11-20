import { createRouter, createWebHashHistory } from "vue-router";

const routes: any = [
    {
      path: "/",
      name: "intro",
      component: () => import("@/page/index.vue"),
      meta:{
        title:"进入系统",
        keepAlive: false
      }
    }
]

 export const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });