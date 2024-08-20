<script setup lang="ts">
import {ref, onMounted} from 'vue';
import L from 'leaflet';
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";

const regStore = useRegistrationStore();

const address = ref<string>('');
const selectedAddress = ref<{ name: string, lat: number, lon: number } | null>(null)
const foundAddresses = ref<{ name: string, lat: number, lon: number }[]>([])
const map = ref<L.Map | null | any>(null);
const markers = ref<L.Marker[]>([]); // Массив маркеров


const isMenuOpen = ref(false);
const canEditAddress = ref(true);

const initMap = () => {
  map.value = L.map('map').setView([55.7558, 37.6176], 10); // если нет доступа к геолокации то ставим москву

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);
};


// получаем геолокации и обновления карты
const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
          const {latitude, longitude} = position.coords;
          map.value.setView([latitude, longitude], 10); // Центрируем карту на текущих координатах
        },
        (error) => {
          console.error('ошибка:', error);
        }
    )
  } else {
    console.log('Геолокация не поддерживается')
  }
};

// удаление всех маркеров
const clearMarkers = () => {
  markers.value.forEach((marker: any) => { // проходимся по массиву с маркерами и удаляем все
    map.value?.removeLayer(marker);
  });
  markers.value = [];
};

// добавления маркера
const addMarker = (lat: number, lon: number, name: string) => {
  const newMarker = L.marker([lat, lon], {
    title: name,
    riseOnHover: true,
    riseOffset: 250,
    autoPan: true,
  }).addTo(map.value);

  newMarker.on('click', () => {
    handleMarkerClick(newMarker, name, lat, lon); // Передаем сам маркер в обработчик клика
  });

  markers.value.push(newMarker);
};

const handleMarkerClick = (marker: L.Marker, name: string, lat: number, lon: number) => {
  // ставим в модель маркера данные с кликнутого маркера
  selectedAddress.value = {
    name: name,
    lat: lat,
    lon: lon,
  };

  // удаляем все классы активных маркеров
  markers.value.forEach((m) => {
    const markerElement = m.getElement();
    markerElement?.classList.remove('selected-marker');
  });

  // делаем нажатый маркер зеленым
  const markerElement = marker.getElement();
  markerElement?.classList.add('selected-marker');
}

const findAddress = async () => {
  isMenuOpen.value = false
  foundAddresses.value = []

  await regStore.getAddresses(address.value);

  clearMarkers(); // Очистка всех маркеров перед добавлением новых
  const bounds = L.latLngBounds([]);

  for (let city of regStore.guessCities) {
    const {lat, lon, name} = city;
    foundAddresses.value.push({name: name, lat: lat, lon: lon});
    addMarker(lat, lon, name);
    bounds.extend([lat, lon]);
  }

  // Если найдено хотя бы одно место масштабируем карту
  if (regStore.guessCities.length > 0) {
    isMenuOpen.value = true
    map.value?.fitBounds(bounds);
  }
};

const handleSubmit = () => {
  regStore.resetSteps();
};

onMounted(() => {
  initMap();
  locateUser();
});


</script>

<template>


  <div class="position-relative field w-100 d-flex flex-column mb-1">
    <label class="inp-default-label">Адрес:</label>
    <v-text-field
        v-model="address"
        variant="outlined"
        :append-inner-icon="'mdi-magnify'"
        @click:append-inner="findAddress"
        @keydown.enter="findAddress"
        @focus="foundAddresses.length ? isMenuOpen = true : isMenuOpen = false"
        @blur="isMenuOpen ? isMenuOpen = false : false"
    />
    <v-fade-transition>
      <v-list
          class="address-menu-selector"
          v-if="isMenuOpen"
      >
        <v-list-item-action>
          <v-btn color="green" class="w-100 text-none">Выбрать на карте</v-btn>
        </v-list-item-action>
        <v-list-item
            v-for="(item, index) in foundAddresses"
            :key="index"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-fade-transition>

  </div>

  <div id="map" style="height: 300px; width: 100%;"></div>

  <v-fade-transition>
    <div v-if="selectedAddress" class="selected-address-block d-flex w-100 flex-column ga-1 pt-2">
      <h5 class="align-self-center">Выбранный адрес:</h5>
      <div class="d-flex align-items-center justify-content-center">
        <p class="address-text ma-0">{{ selectedAddress.name }}</p>
      </div>
    </div>
  </v-fade-transition>
  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="d-flex gap-3 mt-5">
      <v-btn
          class="text-none flex-1-0"
          variant="outlined"
          @click="regStore.prevStep()"
      >
        Назад
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
      >
        Далее
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped>
#map {
  border-radius: 15px;
}

.address-menu-selector {
  position: absolute;
  width: 100%;
  top: 106px;
  right: 0;
  z-index: 9999;
  border: 1px solid black;
  max-height: 300px;
}

.address-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
