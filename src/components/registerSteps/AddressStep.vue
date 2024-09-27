<script setup lang="ts">
import {ref, onMounted} from 'vue';
import L from 'leaflet';
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";
import {useNotificationStore} from "@/stores/notifications";

const notificationStore = useNotificationStore();
const regStore = useRegistrationStore();

const address = ref<string>('');
const selectedAddress = ref<{ name: string, lat: number, lon: number } | null>(null)
const map = ref<L.Map | null | any>(null);
const markers = ref<L.Marker[]>([]); // Массив маркеров

const isMenuOpen = ref(false);
const addressNotFound = ref(false);


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

const handleMarkerClick = (marker: any, name: string, lat: number, lon: number) => {
  map.value?.setView([lat, lon], 15); // центрируем карту на выбранный маркер

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const findAddress = async () => {
  if  (regStore.pending || !address.value.length) return

  addressNotFound.value = false;

  await regStore.getAddresses(address.value);

  if (regStore.error ){
    notificationStore.addNotification('error', regStore.error, 3000);
    addressNotFound.value = true;
    return
  }

  clearMarkers(); // Очистка всех маркеров перед добавлением новых
  const bounds = L.latLngBounds([]);

  for (let city of regStore.guessCities) {
    const {lat, lon, name} = city;
    addMarker(lat, lon, name);
    bounds.extend([lat, lon]);
  }

  isMenuOpen.value = true
  map.value?.fitBounds(bounds);
};

const handleListClick = (item: { name: string, lat: number, lon: number }) => {
  console.log(item)
  // маркер который соответствует координатам выбранного элемента списка
  const marker = markers.value.find(m => m.getLatLng().lat === item.lat && m.getLatLng().lng === item.lon);

  if (marker) {
    handleMarkerClick(marker, item.name, item.lat, item.lon);  // Вызываем обработку клика по маркеру
    isMenuOpen.value = false
  }
};

const handleSubmit = () => {
  if (!selectedAddress.value) return

  regStore.setNewUserAddress(selectedAddress.value)

  regStore.nextStep();
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
        @focus="isMenuOpen = true"
        @blur="isMenuOpen && (addressNotFound || !regStore.guessCities.length) ? isMenuOpen = false : false "
    />

    <v-fade-transition>
      <v-list
          class="address-menu-selector"
          v-if="isMenuOpen"
      >
        <template v-if="regStore.pending">
          <v-progress-circular
              class="align-self-center"
              color="green"
              indeterminate
          ></v-progress-circular>
        </template>
        <template v-if="addressNotFound">
          <v-list-item>
            <v-list-item-title class="text-center">Адрес не найден</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="!addressNotFound && !regStore.pending && regStore.guessCities.length">
          <v-list-item-action class="w-100">
            <v-btn color="green" class="w-100 text-none" @click="isMenuOpen = false">Выбрать на карте</v-btn>
          </v-list-item-action>
          <v-list-item
              v-for="(item, index) in regStore.guessCities"
              :key="index"
              @click="handleListClick(item)"
          >
            <v-list-item-title class="address-text">{{ item.name }}</v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="!addressNotFound && !regStore.pending && !regStore.guessCities.length">
          <v-list-item>
            <v-list-item-title class="text-center">Найдите свой адрес</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-fade-transition>

  </div>

  <div id="map" style="height: 300px; width: 100%;"></div>

  <v-fade-transition>
    <div v-if="selectedAddress" class="selected-address-block d-flex w-100 flex-column ga-1 pt-2">
      <h5 class="align-self-center">Выбранный адрес:</h5>
      <div class="d-flex align-items-center justify-content-center">
        <p class="address-text text-center ma-0">{{ selectedAddress.name }}</p>
      </div>
    </div>
  </v-fade-transition>

  <v-form @submit.prevent="handleSubmit" class="w-100 d-flex flex-column gap-3">

    <div class="d-flex flex-column gap-1 mt-5">

      <v-btn
          class="text-none flex-1-0"
          type="submit"
          variant="outlined"
          :disabled="regStore.pending"
      >
        Далее
      </v-btn>
      <v-btn
          class="text-none flex-1-0"
          @click="regStore.prevStep()"
          :disabled="regStore.pending"
          variant="plain"
          color="green"
      >
        Вернуться назад
      </v-btn>
    </div>
  </v-form>

</template>

<style scoped lang="scss">
#map {
  border-radius: 15px;
  border: 1px solid black;

}

.address-menu-selector {
  position: absolute;
  width: 100%;
  top: 106px;
  right: 0;
  z-index: 9999;
  border: 1px solid black;
  max-height: 300px;
  border-radius: 15px;
  padding: 15px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.address-text {
  display: -webkit-box; /* Используется для реализации многострочного обрезания текста */
  -webkit-line-clamp: 2; /* Ограничение на 2 строки */
  -webkit-box-orient: vertical; /* Указывает, что нужно обрезать текст по вертикали */
  overflow: hidden; /* Обрезка текста, который не помещается */
  text-overflow: ellipsis; /* Добавляет многоточие в конце строки, если текст слишком длинный */
  white-space: normal; /* Обеспечивает нормальный перенос строк */
}





/* скролбар джля списка */
.address-menu-selector::-webkit-scrollbar {
  width: 8px; /* Ширина скроллбара */
  margin-right: 5px;
}

.address-menu-selector::-webkit-scrollbar-thumb {
  background-color: #c4c4c4; /* Цвет ползунка */
  border-radius: 15px; /* Скругление ползунка */

}

.address-menu-selector::-webkit-scrollbar-track {
  margin: 10px;
  background-color: rgb(var(--v-theme-background));
  border-radius: 15px;
}
</style>
