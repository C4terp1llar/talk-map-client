<script setup lang="ts">
import Switcher from "@/components/common/switcher.vue";
import {useFindFriendFilterStore} from "@/stores/findFriendFilter";
import {useUserStore} from "@/stores/user";
import {computed} from "vue";

interface Props {
  disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const friendFilter = useFindFriendFilterStore();
</script>

<template>
  <div class="search-friend-global__wrapper">
    <span class="search-friend-global__text">Глобальный поиск</span>
    <switcher :disabled="props.disabled" :check="friendFilter.globalSearch" @switch="friendFilter.globalSearch = !friendFilter.globalSearch"/>
  </div>
</template>

<style scoped lang="scss">
.search-friend-global__wrapper{
  display: flex;
  gap: 10px;
  position: relative;


  .search-friend-global__text{
    font-weight: 500;
  }
}
</style>