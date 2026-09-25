import { createRouter, createWebHashHistory } from "vue-router";

import Main from "./views/Main.vue";
import Wizard from "./views/Wizard.vue";
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: Main,
    },
    {
      path: "/randomizer",
      name: "randomizer",
      component: Wizard,
    },
  ],
});

export default router;
