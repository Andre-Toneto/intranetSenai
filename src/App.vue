<template>
  <v-app>
    <AppToolbar />
    <AppNavigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppToolbar from '@/components/appToolbar/index.vue'
import AppNavigation from '@/components/appNavigation/index.vue'
</script>
