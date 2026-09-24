import { createRouter, createWebHashHistory } from "vue-router";

import Main from "./views/Main.vue";
import Randomizer from "./views/Randomizer.vue";
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
      component: Randomizer,
    },
  ],
});

export default router;
