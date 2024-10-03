<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import L from 'leaflet';
import {rules} from "@/helpers/baseTextValidator";
import {useRegistrationStore} from "@/stores/regSteps";
import {useNotificationStore} from "@/stores/notifications";
import type {Address} from "@/helpers/interfaces";
import {onClickOutside} from "@vueuse/core";

const notificationStore = useNotificationStore();
const regStore = useRegistrationStore();


const deepCity = ref<string>('');
const deepStreet = ref<string>('');
const deepHouse = ref<string>('');

const address = ref<string>('');
const selectedAddress = ref<Address | null>(null)

const map = ref<L.Map | null | any>(null);
const markers = ref<L.Marker[]>([]);

const isMenuOpen = ref(false);
const isDeepSearch = ref(false);
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

const clearMarkers = () => {
  markers.value.forEach((marker: any) => {
    map.value?.removeLayer(marker);
  });
  markers.value = [];
};


const addMarker = (city: Address) => {
  const addressTitle = nameString(city)

  const newMarker = L.marker([city.lat, city.lon], {
    title: addressTitle,
    riseOnHover: true,
    riseOffset: 250,
    autoPan: true,
  }).addTo(map.value);

  newMarker.on('click', () => {
    handleMarkerClick(newMarker, city); // Передаем сам маркер в обработчик клика
  });

  markers.value.push(newMarker);
};

const handleMarkerClick = (marker: any, city: Address) => {

  map.value?.setView([city.lat, city.lon], 15);

  selectedAddress.value = city

  markers.value.forEach((m) => {
    const markerElement = m.getElement();
    markerElement?.classList.remove('selected-marker');
  });

  const markerElement = marker.getElement();
  markerElement?.classList.add('selected-marker');
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const findAddress = async () => {
  if (regStore.pending) return

  if (!isDeepSearch.value) {
    if (!address.value.length) return
  } else {
    if (!deepCity.value.length || !deepHouse.value.length || !deepStreet.value.length) return
  }

  if (!isMenuOpen.value) isMenuOpen.value = true

  addressNotFound.value = false;
  regStore.guessCities = [];

  const searchQuery = isDeepSearch.value ? `${deepCity.value} ул ${deepStreet.value} ${deepHouse.value}` : address.value

  const isNotFound = await regStore.getAddresses(searchQuery);

  if (isNotFound) {
    notificationStore.addNotification('info', isNotFound, 3000);
    addressNotFound.value = true;
    return
  }

  if (regStore.error) {
    notificationStore.addNotification('error', regStore.error, 3000);
    addressNotFound.value = true;
    return
  }

  clearMarkers();

  const bounds = L.latLngBounds([]);

  for (let city of regStore.guessCities) {
    addMarker(city);
    bounds.extend([city.lat, city.lon]);
  }

  isMenuOpen.value = true
  map.value?.fitBounds(bounds);
};

const handleListClick = (item: Address) => {
  console.log(item)

  const marker = markers.value.find(m => m.getLatLng().lat === item.lat && m.getLatLng().lng === item.lon);

  if (marker) {
    handleMarkerClick(marker, item);  // Вызываем обработку клика по маркеру
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

const clickOutside = () => {
  if (isMenuOpen.value && !regStore.pending && !regStore.guessCities.length) {
    isMenuOpen.value = false;
  }
};

const refGuessCitiesList = ref<HTMLDivElement | null>(null);
onClickOutside(refGuessCitiesList, clickOutside);

const nameString = (item: Address): string => {
  if (item.city && item.road && item.house_number && item.name) {
    return `${item.city}, ${item.road}, ${item.house_number}, ${item.name}`
  } else if (item.city && item.road && item.house_number) {
    return `${item.city}, ${item.road}, ${item.house_number}`
  } else if (item.city && item.road) {
    return `${item.city}, ${item.road}`
  } else {
    return item.display_name.split(', ').reverse().slice(0, 6).reverse().join(', ');
  }
}
</script>

<template>


  <div class="position-relative field w-100 d-flex flex-column mb-1 h-100">

    <div v-if="!isDeepSearch">
      <label class="inp-default-label">Адрес:</label>

      <div class="d-flex gap-1">
        <v-text-field
            v-model="address"
            variant="outlined"
            @keydown.enter="findAddress"
            @focus="isMenuOpen = true"
            hide-details
            placeholder="Город, ул Улица, Номер дома"
            :rules="[rules.required]"
        />

        <v-btn class="search-btn" variant="tonal" @click="findAddress">
          <v-icon size="large">mdi-magnify</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="deep-search-block" v-else>
      <div class="city-info-block">
        <label class="inp-default-label">Город: </label>
        <v-text-field
            v-model="deepCity"
            hide-details
            variant="outlined"
            placeholder="Город"
            @focus="isMenuOpen = true"
            :rules="[rules.required]"
        ></v-text-field>
      </div>
      <div class="street-info-block">
        <div class="w-100">
          <label class="inp-default-label">Улица: </label>
          <v-text-field
              v-model="deepStreet"
              hide-details="auto"
              variant="outlined"
              placeholder="Улица"
              @focus="isMenuOpen = true"
              :rules="[rules.required]"
          ></v-text-field>
        </div>
        <div class="w-75">
          <label class="inp-default-label">Дом: </label>
          <v-text-field
              v-model="deepHouse"
              hide-details
              variant="outlined"
              placeholder="Дом"
              @focus="isMenuOpen = true"
              :rules="[rules.required]"
          ></v-text-field>
        </div>
        <v-btn class="search-btn-deep search-btn" variant="tonal" @click="findAddress">
          <v-icon size="large">mdi-magnify</v-icon>
        </v-btn>
      </div>
    </div>

    <v-btn @click="isDeepSearch = !isDeepSearch" class="text-none mt-1" variant="plain">
      {{ isDeepSearch ? 'Обычный поиск' : 'Детальный поиск' }}
    </v-btn>


    <v-fade-transition>
      <v-list
          ref="refGuessCitiesList"
          :class="['address-menu-selector', isDeepSearch ? 'address-menu-selector-deep' : '']"
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
            <v-list-item-title class="address-text">{{ nameString(item) }}</v-list-item-title>
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
      <h5 class="align-self-center ma-0">Выбранный адрес:</h5>
      <div class="d-flex align-items-center justify-content-center">
        <p class="address-text text-center ma-0">{{ nameString(selectedAddress) }}</p>
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
  max-height: 350px;
  top: 84px;
  right: 0;
  z-index: 9999;
  border: 1px solid black;
  border-radius: 15px;
  padding: 15px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.address-menu-selector-deep {
  @media screen and (max-width: 500px) {
    top: 168px;
  }
}

.address-text {
  display: -webkit-box; /* Используется для реализации многострочного обрезания текста */
  -webkit-line-clamp: 2; /* Ограничение на 2 строки */
  -webkit-box-orient: vertical; /* Указывает, что нужно обрезать текст по вертикали */
  overflow: hidden; /* Обрезка текста, который не помещается */
  text-overflow: ellipsis; /* Добавляет многоточие в конце строки, если текст слишком длинный */
  white-space: normal; /* Обеспечивает нормальный перенос строк */
}

.search-btn {
  height: 56px;
}

.search-btn-deep {
  top: 24px;
}

.deep-search-block {
  display: flex;
  gap: 4px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }

  .city-info-block {
    width: 50%;
    @media screen and (max-width: 500px) {
      width: 100%;
    }
  }

  .street-info-block {
    width: 100%;
    display: flex;
    gap: 4px;
  }
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
