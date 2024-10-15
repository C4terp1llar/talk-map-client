import 'bootstrap/dist/css/bootstrap.min.css';
import '@mdi/font/css/materialdesignicons.css'
import 'flag-icons/css/flag-icons.min.css';
import './assets/main.scss';
import './assets/map.scss'
import './assets/cropper.scss'
import 'leaflet/dist/leaflet.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {autoAnimatePlugin} from '@formkit/auto-animate/vue'

import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(autoAnimatePlugin)

app.mount('#app')
