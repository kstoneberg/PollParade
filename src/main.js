import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vuetify/styles'; // Vuetify styles

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// If using Material Design Icons
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
});

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app');