import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ui from "@nuxt/ui/vue-plugin";
import router from "./router";

// Forces Dark Mode
const colorSchemeKey = "vueuse-color-scheme";
if (
  localStorage.getItem(colorSchemeKey) === null ||
  localStorage.getItem(colorSchemeKey) === "auto"
) {
  localStorage.setItem(colorSchemeKey, "dark");
}

const app = createApp(App);

app.use(router);
app.use(ui);

app.mount("#app");
