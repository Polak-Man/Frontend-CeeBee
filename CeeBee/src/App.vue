<script setup>
import Ceebee from './components/ceebee.vue'
import Callback from './components/Callback.vue';

</script>

<template>
  <Ceebee />
  <router-view :key="$route.fullPath"></router-view>
</template>

<style scoped>
/* App-level styles (none needed) */
</style>
