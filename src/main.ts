import { createApp, h, provide } from 'vue';
import App from './App.vue';
import apolloClient from './apollo-client';
import { DefaultApolloClient } from '@vue/apollo-composable';
import './assets/style.css';
import router from './router';
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(router);

app.mount('#app');
