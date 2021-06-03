import { createApp } from 'vue';
import App from './app.vue';
import store from './store';
(async () => {
  let json = {};
  try {
    const id = /\bid\b\=([^&]+)/.exec(location.search)?.[1];
    console.log('id', id);
    const base = 'https://ace-api.qrl.sh';
    // const base = /localhost/.test(location.href) && 'http://localhost:3000' || 'https://ace-api.qrl.sh';
    const response = await fetch(`${ base }/api/advice?id=${ id }`  );
    console.log('freesa response ok?', response?.ok);
    const json = await response.json();
    console.log('json', json);
    if (json) {
      await store.dispatch('initialJSON', Object.freeze({ ...json, patientId: id }));
    }
  } catch ({ message }) {
    console.log('error', message);
  }
  createApp(App)
    .use(store)
    .mount('#app');
})();
