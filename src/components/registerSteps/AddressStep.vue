<script setup lang="ts">
import {ref, onMounted} from 'vue';
import L from 'leaflet';
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";

const regStore = useRegistrationStore();

const address = ref<string>('');
const map = ref<L.Map | null | any>(null);
const markers = ref<L.Marker[]>([]); // Массив маркеров

const initMap = () => {
  map.value = L.map('map').setView([55.7558, 37.6176], 10); // если нет доступа к геолокации то ставим москву

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);
};

// Функция для получения геолокации и обновления карты
const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
          const {latitude, longitude} = position.coords;

          map.value.setView([latitude, longitude], 10); // Центрируем карту на текущих координатах
          clearMarkers(); // Удаление всех предыдущих маркеров
          addMarker(latitude, longitude, 'Ты здесь :)'); // Добавляем стандартный маркер
        },
        (error) => {
          console.error('ошибка:', error);
        }
    )
  } else {
    console.log('Геолокация не поддерживается')
  }
};

// Функция для удаления всех маркеров
const clearMarkers = () => {
  markers.value.forEach((marker: any) => { // проходимся по массиву с маркерами и удаляем все
    map.value?.removeLayer(marker);
  });
  markers.value = [];
};

// Функция для добавления маркера
const addMarker = (lat: number, lon: number, name: string) => {
  const newMarker = L.marker([lat, lon], {
    title: name,
    riseOnHover: true,
    riseOffset: 250,
    autoPan: true
  }).addTo(map.value);

  markers.value.push(newMarker);
};

const onMarkerClick = () => {

}

const findAddress = async () => {
  await regStore.getAddresses(address.value);

  clearMarkers(); // Очистка всех маркеров перед добавлением новых
  const bounds = L.latLngBounds([]);

  for (let city of regStore.guessCities) {
    const {lat, lon, name} = city;
    addMarker(lat, lon, name);
    bounds.extend([lat, lon]);
  }

  // Если найдено хотя бы одно место, масштабируем карту
  if (regStore.guessCities.length > 0) {
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

  <v-text-field
      v-model="address"
      :rules="[rules.required]"
      class="w-100"
      variant="outlined"
      append-inner-icon="mdi-magnify"
      @click:append-inner="findAddress"
  />

<!--  <div class="d-flex gap-3">-->

<!--      <v-list class="city-list" v-if="regStore.guessCities.length > 0">-->
<!--        <v-list-item-->
<!--            v-for="(city, i) in regStore.guessCities"-->
<!--            :key="i"-->
<!--        >-->
<!--          {{city}}-->
<!--        </v-list-item>-->
<!--      </v-list>-->

<!--    <div id="map" style="height: 300px; width: 100%;"></div>-->
<!--  </div>-->

  <div id="map" style="height: 300px; width: 100%;"></div>

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

</style>
