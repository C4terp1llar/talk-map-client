<script setup lang="ts">
import ThemeSwitcher from "@/components/themeSwitcher.vue";
</script>

<template>
  <footer class="footer">
    <theme-switcher />
    <p>&copy; 2024 TalkMap. Все права защищены.</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
  border-radius: 15px;
  box-shadow: 0 1px 20px currentColor;
  p {
    margin: 0;
    font-size: 14px;
    color: #777;
  }
}
</style>
